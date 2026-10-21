const argon2 = require('argon2')

async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
        type: argon2.argon2id
    })
}

async function verifyPassword(
    hash: string,
    password: string
): Promise<boolean> {
    return argon2.verify(hash, password)
}

module.exports = {
    hashPassword,
    verifyPassword
}
