import { z } from 'zod'

export const usernameField = z.string({ error: 'Username is required.' })
    .min(3, 'Username must be at least 3 characters.')
    .max(30, 'Username must be at most 30 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.')

export const emailField = z.string({ error: 'Email is required.' })
    .trim()
    .toLowerCase()
    .max(254, 'Email must be at most 254 characters.')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address.')

export const passwordField = z.string({ error: 'Password is required.' })
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

export const updateUserSchema = z.strictObject({
    name: z.string().max(100).nullable().optional(),
    biography: z.string().nullable().optional(),
    avatarUrl: z.url().max(500).nullable().optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided' }
)