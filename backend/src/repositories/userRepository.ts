import { prisma } from '../db/prisma/prisma.ts'
import { hashPassword } from '../services/passwordService.ts';
import type { NewUserData, User, UserPublic } from '../types/user.ts'

async function findUserByUsername(
    _username: string
): Promise<User | null> {
 // Not implmented yet: Implement with Prisma.
    throw new Error('User repository is not implemented yet')
}

async function findUserByEmail(
    _email: string
): Promise<User | null> {
	// Not implmented yet: Implement with Prisma.
    throw new Error('User repository is not implemented yet')
}

async function findUserById(
    _id: string
): Promise<User | null> {
	// Not implmented yet: Implement with Prisma.
    throw new Error('User repository is not implemented yet')
}

const userPublicSelect = {
    id: true,
    username: true,
    email: true,
} as const

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
