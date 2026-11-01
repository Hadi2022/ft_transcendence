import type { User, NewUserData, OwnProfile, UserProfile, UserOrderBy } from '../types/user.ts'
import { UserNameConflictError, UserEmailConflictError } from '../errors/userErrors.ts'
import { hashPassword, verifyPassword } from './passwordService.ts'
import * as userRepository from '../repositories/userRepository.ts'
import { UniqueConstraintError } from '../errors/RepositoryErrors.ts'
import type { Order } from '../types/query.ts'

type CreateUserInput = {
    username: string
    email: string
    password: string
}

type ListUserProfilesInput = {
    order?: Order
    orderBy?: UserOrderBy,
}

async function prepareUser(input: CreateUserInput): Promise<NewUserData> {
    const passwordHash = await hashPassword(input.password)

    return {
        username: input.username,
        email: input.email,
        passwordHash
    }
}

async function createUser(input: CreateUserInput): Promise<UserProfile> {

    const userData = await prepareUser(input)
    try {
        const userPublic = await userRepository.createUser(userData);
        return userPublic;
    }
    catch (error) {
        if (error instanceof UniqueConstraintError) {
            if (error?.field === 'email')
                throw new UserEmailConflictError('The email address is already registered');
            else if (error?.field === 'username')
                throw new UserNameConflictError('The username is already in use');
        }
        throw error;
    }

}

async function isValidCredentials(
    email: string,
    password: string
): Promise<User | null> {

    const user = await userRepository.findByEmail(email)

    if (!user) {
        return null
    }

    const isValid = await verifyPassword(user.passwordHash, password)

    if (!isValid) {
        return null
    }

    return user
}

async function listUserProfiles(params: ListUserProfilesInput): Promise<UserProfile[]> {
    
    return userRepository.findMany({
        order: params.order,
        orderBy: params.orderBy,
    })

}

// Returns full user object
async function findUserById(id: string): Promise<User | null> {
    return userRepository.findById(id)
}

// Returns only public user fields
async function findUserProfileById(id: string): Promise<UserProfile | null> {
    return userRepository.findProfileById(id)
}

// Public profile + email
async function findUserOwnProfileById(id: string): Promise<OwnProfile | null> {
    return userRepository.findOwnProfileById(id)
}

export {
    prepareUser,
    createUser,
    isValidCredentials,
    listUserProfiles,
    findUserById,
    findUserProfileById,
    findUserOwnProfileById,
}
