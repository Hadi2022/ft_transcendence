import { prisma } from '../db/prisma/prisma.ts'
import { idParamSchema } from '../schemas/common.ts';
import { emailSchema, usernameSchema } from '../schemas/user.ts';
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

async function findUserByUsernameCredentials(
    _username: string
): Promise<User | null> {

    const validationUsername = usernameSchema.safeParse({username:_username});
    if (!validationUsername.success)
        throw validationUsername.error;
    const user = await prisma.user.findUnique(
        {
            where: {username:validationUsername.data.username},
            select:userPrivateSelect
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
            where: {email: validationEmail.data.email},
            select: userPublicSelect
        }
    )
    return user;
}

async function findUserById(
    _id: string
): Promise<UserPublic | null> {

    const validationId = idParamSchema.safeParse({id:_id});
    if (!validationId.success)
        throw validationId.error;
    const user = await prisma.user.findUnique(
        {
            where: {id:_id},
            select:userPublicSelect
        }
    )
    return user;
}

async function createUser(
    _data: NewUserData
): Promise<UserPublic> {

    // Not implmented yet: Implement with Prisma.
    throw new Error('User repository is not implemented yet')
}

export {
    findUserByUsername,
	findUserByEmail,
	findUserById,
    createUser,
    findUserByUsernameCredentials
}
