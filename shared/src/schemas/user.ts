import { z } from 'zod'
import { ErrorDetails as E } from '@transcendence/shared/errors/error-details'

export const usernameField = z.string({ error: E.USERNAME_REQUIRED })
    .min(3, E.USERNAME_TOO_SHORT)
    .max(30, E.USERNAME_TOO_LONG)
    .regex(/^[a-zA-Z0-9_]+$/, E.USERNAME_INVALID_CHARS)

export const emailField = z.string({ error: E.EMAIL_REQUIRED })
    .trim()
    .toLowerCase()
    .max(254, E.EMAIL_TOO_LONG)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, E.EMAIL_INVALID_FORMAT)

export const passwordField = z.string({ error: E.PASSWORD_REQUIRED })
    .min(6, E.PASSWORD_TOO_SHORT)
    .max(128, E.PASSWORD_TOO_LONG)
    .regex(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/,
        E.PASSWORD_NO_SPECIAL_CHAR
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

export const updateUserSchema = z.object({
    name: z.string(E.INVALID_VALUE).max(100, E.NAME_TOO_LONG).nullable().optional(),
    biography: z.string(E.INVALID_VALUE).nullable().optional(),
    avatarUrl: z.url({ error: E.AVATAR_URL_INVALID }).max(500, E.AVATAR_URL_TOO_LONG).nullable().optional(),
}, {
    error: E.INVALID
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: E.NO_FIELDS_PROVIDED }
).strict()