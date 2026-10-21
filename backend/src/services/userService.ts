import type { NewUserData } from '../types/user.ts'

const { hashPassword } = require('./passwordService.ts')

type CreateUserInput = {
    username: string
    password: string
}

async function prepareUser(input: CreateUserInput): Promise<NewUserData> {
    const passwordHash = await hashPassword(input.password)

    return {
        username: input.username,
        passwordHash
    }
}

module.exports = {
    prepareUser
}