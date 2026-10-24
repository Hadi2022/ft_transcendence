import { UserValidationError } from '../errors/userErrors.ts'

type RegisterInput = {
    username: string
    email: string
    password: string
}

function validateRegisterInput(input: unknown): RegisterInput {
    if (
        typeof input !== 'object' || input === null || Array.isArray(input)
    ) {
        throw new UserValidationError('Invalid request body')
    }

    const data = input as Record<string, unknown>
    const { username, email, password } = data

    if (typeof username !== 'string') {
        throw new UserValidationError('Username must be a string')
    }

    if (username.length < 3 || username.length > 30) {
        throw new UserValidationError('Username must contain between 3 and 30 characters')
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new UserValidationError(
            'Username may only contain letters, numbers and underscores'
        )
    }

    if (typeof email !== 'string') {
        throw new UserValidationError('Email must be a string')
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (
        normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
        throw new UserValidationError('Invalid email address')
    }

    if (typeof password !== 'string') {
        throw new UserValidationError('Password must be a string')
    }

    if (password.length < 6 || password.length > 128) {
        throw new UserValidationError('Password must contain between 6 and 128 characters')
    }

	if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) {
		throw new UserValidationError('Password must contain at least one special character')
	}

    return {
        username,
        email: normalizedEmail,
        password
    }
}

export { validateRegisterInput }
