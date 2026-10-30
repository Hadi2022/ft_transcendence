import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma/prisma.ts'
import type { NewUserData, User, UserPublic } from '../types/user.ts'
import { UniqueConstraintError } from '../errors/RepositoryErrors.ts';

const userPublicSelect = {
    id: true,
    username: true,
    email: true,
} as const

const userPrivateSelect = {
    id: true,
    username: true,
    email: true,
    passwordHash: true,
} as const

async function findUserByUsername(
    _username: string
): Promise<UserPublic | null> {

    const user = await prisma.user.findUnique(
        {
            where: { username: _username },
            select: userPublicSelect
        }
    )
    return user;
}

async function findUserByUsernameCredentials(
    _username: string
): Promise<User | null> {

    const user = await prisma.user.findUnique(
        {
            where: { username: _username },
            select: userPrivateSelect
        }
    )
    return user;
}

async function findUserByEmail(
    _email: string
): Promise<UserPublic | null> {

    const user = await prisma.user.findUnique(
        {
            where: { email: _email },
            select: userPublicSelect
        }
    )
    return user;
}

async function findUserByEmailCredentials(
    _email: string
): Promise<User | null> {

    const user = await prisma.user.findUnique(
        {
            where: { email: _email },
            select: userPrivateSelect
        }
    )
    return user;
}

async function findUserById(
    _id: string
): Promise<UserPublic | null> {

    const user = await prisma.user.findUnique(
        {
            where: { id: _id },
            select: userPublicSelect
        }
    )
    return user;
}

async function createUser(
    _data: NewUserData
): Promise<UserPublic> {

    try {
        const user = await prisma.user.create({
            data: {
                username: _data.username,
                email: _data.email,
                passwordHash: _data.passwordHash
            },
            select:userPublicSelect
        });
        return user;
    }
    catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2002') {
            const target = (error.message as string);
            if (target.includes('users_email_key')) {
                throw new UniqueConstraintError('Unique constraint violation: record already exists', 'email');
            }
            if (target.includes('users_username_key')) {
                throw new UniqueConstraintError("Unique constraint violation: record already exists", 'username');
            }
        }
        throw error;
    }
}

export {
    findUserByUsername,
    findUserByEmail,
    findUserById,
    createUser,
    findUserByUsernameCredentials,
    findUserByEmailCredentials,
}
