import type { NewUserData, User, UserPublic } from '../types/user.ts'
import { UserConflictError } from '../errors/userErrors.ts'
import { hashPassword, verifyPassword } from './passwordService.ts'
import * as userRepository from '../repositories/userRepository.ts'
import { UniqueConstraintError } from '../repositories/errors.userRepository.ts'

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

    const existingUser = await userRepository.findUserByUsername(
        input.username
    )

    if (existingUser) {
        throw new UserConflictError('Username already exists')
    }

    const existingEmail = await userRepository.findUserByEmail(
        input.email
    )

    if (existingEmail) {
        throw new UserConflictError('Email already exists')
    }

    const userData = await prepareUser(input)
    try {
        const userPublic = userRepository.createUser(userData);
        return userPublic;
    }
    catch (error) {
        if (error instanceof UniqueConstraintError) {
            if (error?.field === 'email')
                throw new UserConflictError('The email address is already registered');
            else if (error?.field === 'username')
                throw new UserConflictError('The username is already in use');
        }
        throw error;
    }

}

async function isValidCredentials(
    username: string,
    password: string
): Promise<User | null> {

    const user = await userRepository.findUserByUsernameCredentials(username)

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
