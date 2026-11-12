import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma/prisma.ts'
import type { NewUserData, UpdateUserData, User, UserProfile, OwnProfile, UserOrderBy, NewUserDataGoogle } from '../types/user.ts'
import { UniqueConstraintError, RecordNotFoundError } from '../errors/RepositoryErrors.ts';
import type { Order } from '../types/query.ts';
import { generateBaseUsername } from '../utils/username.ts';
import { UserNameConflictError } from '../errors/userErrors.ts';

export const ownProfileOmit = {
    googleId: true,
    passwordHash: true,
    updatedAt: true,
} satisfies Prisma.UserOmit

export const userProfileOmit = {
    ...ownProfileOmit,
    email: true,
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

export async function findProfileByUsername(
    _username: string
): Promise<UserProfile | null> {

    const user = await prisma.user.findUnique(
        {
            where: { username: _username },
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

export async function updateUser(
    _id: string,
    _data: UpdateUserData
): Promise<OwnProfile> {

    try {
        return await prisma.user.update({
            where: { id: _id },
			// Omit undefined fields to satisfy Prisma's strict optional property types.
            data: {
                ...(_data.name !== undefined && { name: _data.name }),
                ...(_data.biography !== undefined && { biography: _data.biography }),
                ...(_data.avatarUrl !== undefined && { avatarUrl: _data.avatarUrl })
            },
            omit: ownProfileOmit
        })
    }
    catch (error: unknown) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            throw new RecordNotFoundError('User not found')
        }

        throw error
    }
}

export async function findUserByGoogleId(
    _googleId: string
): Promise<UserProfile | null> {

    const user = await prisma.user.findUnique(
        {
            where: { googleId: _googleId },
            omit: userProfileOmit
        }
    )
    return user;
}

export async function createGoogleUser(
    _data: NewUserDataGoogle
): Promise<UserProfile | null> {

    let username_base;
    try {
        username_base = generateBaseUsername(_data.email);
    } catch (error) {
        throw error;
    }
    let randomSuffix = 0;
    let attemps = 0;
    let limit = 15;
    let username_atempt = username_base;
    while (attemps < limit){
        let check = await prisma.user.findUnique({
            where: { username: username_atempt}
        });
        if (check != null)
        {
			randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 random digits
            username_atempt = `${username_base}_${randomSuffix}`;
            attemps++;
        }
        else
            break ;
    }
    if (attemps == 15)
        throw new UserNameConflictError('A unique username could not be generated after several attempts due to high concurrency.')

    while (attemps < limit) {
        try {
            const user = await prisma.user.create({
                data: {
                    username: username_atempt,
                    email: _data.email,
                    passwordHash: _data.passwordHash,
                    googleId: _data.googleId,
                    isVerified: true,
                    name: _data.name,
                    avatarUrl: _data.picture,
                },
                omit: userProfileOmit
            });
            return user;
        }
        catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2002') {
                const target = error.message as string;

                if (target.includes('users_email_key'))
                    throw new UniqueConstraintError('Unique constraint violation: record already exists', 'email');

				if (target.includes('googleId') || target.includes('users_google_id_key')) {
					const existingUser = await findUserByGoogleId(_data.googleId);
					if (existingUser)
						return existingUser;
					throw error;
				}

                if (target.includes('username') || target.includes('users_username_key')) {
                    randomSuffix = Math.floor(1000 + Math.random() * 9000);
                    username_atempt = `${username_base}_${randomSuffix}`;
                    attemps++;
                    continue;
                }
            }
            throw error;
        }
    }

    throw new UserNameConflictError(
        'A unique username could not be generated after several attempts.'
    );
}
