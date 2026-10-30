import { z } from 'zod'

const argon2Regex = /^\$argon2(id?|d)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/;


export const registerUserSchema = z.object({
    username: z.string()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z0-9_]+$/),

    email: z.string()
        .trim()
        .toLowerCase()
        .max(254)
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),

    password: z.string()
        .min(6)
        .max(128)
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/)
})

export const emailSchema = z.object({
    email: z.string()
        .trim()
        .toLowerCase()
        .max(254)
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
})

export const usernameSchema = z.object({
    username: z.string()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z0-9_]+$/),
})

export const UserSchema = z.object({
    username: z.string()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z0-9_]+$/),

    email: z.string()
        .trim()
        .toLowerCase()
        .max(254)
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),

    passwordHash: z.string()
        .regex(argon2Regex)
})
