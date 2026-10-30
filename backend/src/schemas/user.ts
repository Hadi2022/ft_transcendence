import { z } from 'zod'

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