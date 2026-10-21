const { hashPassword } = require('./passwordService.ts')

type CreateUserInput = {
    username: string
    password: string
}

type NewUserData = {
    username: string
    passwordHash: string
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