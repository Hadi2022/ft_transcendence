import { prisma } from '../db/prisma/prisma.ts'
import type { NewUserData, User, userResponseDto } from '../types/user.ts'

const userResponseSelect = {
    id:true,
    username:true,
    email:true,
} as const;

async function findUserByUsername(
    _username: string
): Promise<userResponseDto | null> {
    const user = await prisma.user.findUnique({
        where: {id : _username},
        select: userResponseSelect,
    });
    return user;
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

async function createUser(
    _data: NewUserData
): Promise<User> {
    // Not implmented yet: Implement with Prisma.
    throw new Error('User repository is not implemented yet')
}

export {
    findUserByUsername,
	findUserByEmail,
	findUserById,
    createUser
}
