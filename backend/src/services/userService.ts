import type { NewUserData, User, UserPublic } from '../types/user.ts'
import { UserNameConflictError, UserEmailConflictError } from '../errors/userErrors.ts'
import { hashPassword, verifyPassword } from './passwordService.ts'
import * as userRepository from '../repositories/userRepository.ts'
import { UniqueConstraintError } from '../errors/RepositoryErrors.ts'

type CreateUserInput = {
    username: string
    email: string
    password: string
}

async function prepareUser(input: CreateUserInput): Promise<NewUserData> {
    const passwordHash = await hashPassword(input.password)

    return {
        username: input.username,
        email: input.email,
        passwordHash
    }
}

async function createUser(input: CreateUserInput): Promise<UserPublic> {

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
    identifier: string,
    password: string
): Promise<User | null> {

    const user = await userRepository.findUserByEmailCredentials(identifier)

    if (!user) {
        return null
    }

    const isValid = await verifyPassword(user.passwordHash, password)

    if (!isValid) {
        return null
    }

    return user
}

async function findUserById(id: string): Promise<UserPublic | null> {
    return userRepository.findUserById(id)
}

export {
    prepareUser,
    createUser,
    isValidCredentials,
    findUserById
}
