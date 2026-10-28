import type { NewUserData, User, UserPublic } from '../types/user.ts'

import { UserConflictError } from '../errors/userErrors.ts'
import { hashPassword, verifyPassword } from './passwordService.ts'
import * as userRepository from '../repositories/userRepository.ts'

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

    return userRepository.createUser(userData)
}

async function isValidCredentials(
    username: string,
    password: string
): Promise<User | null> {

    const userPublic = await userRepository.findUserByUsername(username)

    if (!userPublic) {
        return null
    }

    const userPrivate = await userRepository.findUserById(userPublic.id)

    if (!userPrivate) {
        return null
    }

    const isValid = await verifyPassword(userPrivate.passwordHash, password)

    if (!isValid) {
        return null
    }

    return userPrivate
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
