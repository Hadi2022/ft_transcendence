import type { NewUserData, User } from '../types/user.ts'

async function findUserByUsername(
    _username: string
): Promise<User | null> {
    // Not implemented yet: Implement with Prisma.
    throw new Error('User repository is not implemented yet')
}

async function createUser(
    _data: NewUserData
): Promise<User> {
    // Not implmented yet: Implement with Prisma.
    throw new Error('User repository is not implemented yet')
}

module.exports = {
    findUserByUsername,
    createUser
}