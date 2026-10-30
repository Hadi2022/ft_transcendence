import { z } from 'zod'

const argon2Regex = /^\$argon2(id?|d)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/

const usernameField = z.string({ error: 'Username is required.' })
    .min(3, 'Username must be at least 3 characters.')
    .max(30, 'Username must be at most 30 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.')

const emailField = z.string({ error: 'Email is required.' })
    .trim()
    .toLowerCase()
    .max(254, 'Email must be at most 254 characters.')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address.')

const passwordField = z.string({ error: 'Password is required.' })
    .min(6, 'Password must be at least 6 characters.')
    .max(128, 'Password must be at most 128 characters.')
    .regex(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/,
        'Password must contain at least one special character.'
    )

const passwordHashField = z.string({ error: 'Password hash is required.' })
    .regex(argon2Regex, 'Password hash must be a valid argon2 hash.')

export const registerUserSchema = z.object({
    username: usernameField,
    email: emailField,
    password: passwordField,
})

export const emailSchema = z.object({
    email: emailField,
})

export const usernameSchema = z.object({
    username: usernameField,
})

export const UserSchema = z.object({
    username: usernameField,
    email: emailField,
    passwordHash: passwordHashField,
})