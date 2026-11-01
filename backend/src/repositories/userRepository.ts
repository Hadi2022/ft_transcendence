import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma/prisma.ts'
import type { NewUserData, User, UserProfile, OwnProfile, UserOrderBy } from '../types/user.ts'
import { UniqueConstraintError } from '../errors/RepositoryErrors.ts';
import type { Order } from '../types/query.ts';

const userProfileOmit = {
    passwordHash: true,
    email: true,
    updatedAt: true,
} satisfies Prisma.UserOmit

const ownProfileOmit = {
    passwordHash: true,
    updatedAt: true,
} satisfies Prisma.UserOmit

interface FindUsersParams {
    order?: Order | undefined,
    orderBy?: UserOrderBy | undefined,
}

export async function findMany ({order = 'desc', orderBy = 'createdAt'}: FindUsersParams): Promise<UserProfile[]> {

    return prisma.user.findMany({
        orderBy: [{ [orderBy]: order }, { id: order }],
        take: 100, // temporary cap, pagination will replace this
        omit: userProfileOmit
    })
}

export async function findByEmail(
    _email: string
): Promise<User | null> {

    const user = await prisma.user.findUnique(
        {
            where: { email: _email },
        }
    )
    return user;
}

export async function findById(
    _id: string
): Promise<User | null> {

    const user = await prisma.user.findUnique(
        {
            where: { id: _id },
        }
    )
    return user;
}


export async function findProfileById(
    _id: string
): Promise<UserProfile | null> {

    const user = await prisma.user.findUnique(
        {
            where: { id: _id },
            omit: userProfileOmit
        }
    )
    return user;
}

export async function findOwnProfileById(
    _id: string
): Promise<OwnProfile | null> {

    const user = await prisma.user.findUnique(
        {
            where: { id: _id },
            omit: ownProfileOmit
        }
    )
    return user;
}

export async function createUser(
    _data: NewUserData
): Promise<UserProfile> {

    try {
        const user = await prisma.user.create({
            data: {
                username: _data.username,
                email: _data.email,
                passwordHash: _data.passwordHash
            },
            omit: userProfileOmit
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
