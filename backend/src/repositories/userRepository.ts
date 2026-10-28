import { error } from 'node:console';
import { prisma } from '../db/prisma/prisma.ts'
import { idParamSchema } from '../schemas/common.ts';
import { emailSchema } from '../schemas/user.ts';
import { hashPassword } from '../services/passwordService.ts';
import type { NewUserData, User, UserPublic } from '../types/user.ts'

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
            where: {username:_username},
            select: userPublicSelect
        }
    )
    return user;
}

async function findUserByEmail(
    _email: string
): Promise<UserPublic | null> {

    const validationEmail = emailSchema.safeParse({email:_email});
    if (!validationEmail.success)
        throw validationEmail.error;
    const user = await prisma.user.findUnique(
        {
            where: {email: _email},
            select: userPublicSelect
        }
    )
    return user;
}

async function findUserById(
    _id: string
): Promise<User | null> {

    const validationId = idParamSchema.safeParse({id:_id});
    if (!validationId.success)
        throw validationId.error;
    const user = await prisma.user.findUnique(
        {
            where: {id:_id},
            select:userPrivateSelect
        }
    )
    return user;
}

async function createUser(
    _data: NewUserData
): Promise<UserPublic> {

    const createdUser = await prisma.user.create({
        data: {
            username: _data.username,
            email: _data.email,
            passwordHash: _data.passwordHash,
        },
        select: userPublicSelect,
    });
    return createdUser;
}

export {
    findUserByUsername,
	findUserByEmail,
	findUserById,
    createUser
}
