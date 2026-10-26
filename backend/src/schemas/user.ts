import { z } from 'zod'

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