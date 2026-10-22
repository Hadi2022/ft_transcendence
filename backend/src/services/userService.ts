import type { NewUserData, User } from '../types/user.ts'

const { UserConflictError } = require('../errors/userErrors.ts')
const { hashPassword, verifyPassword } = require('./passwordService.ts')
const userRepository = require('../repositories/userRepository.ts')

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

async function createUser(input: CreateUserInput): Promise<User> {
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
    const user = await userRepository.findUserByUsername(username)

    if (!user) {
        return null
    }

    const isValid = await verifyPassword(user.passwordHash, password)

    if (!isValid) {
        return null
    }

    return user
}

module.exports = {
    prepareUser,
    createUser,
    isValidCredentials
}
