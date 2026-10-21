type RegisterInput = {
    username: string
    password: string
}

function validateRegisterInput(input: unknown): RegisterInput {
    if (
        typeof input !== 'object' || input === null || Array.isArray(input)
    ) {
        throw new Error('Invalid request body')
    }

    const data = input as Record<string, unknown>
    const { username, password } = data

    if (typeof username !== 'string') {
        throw new Error('Username must be a string')
    }

    if (username.length < 3 || username.length > 30) {
        throw new Error('Username must contain between 3 and 30 characters')
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error('Username may only contain letters, numbers and underscores')
    }

    if (typeof password !== 'string') {
        throw new Error('Password must be a string')
    }

    if (password.length < 12 || password.length > 128) {
        throw new Error('Password must contain between 12 and 128 characters')
    }

    return { username, password }
}

module.exports = { validateRegisterInput }