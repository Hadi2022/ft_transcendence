
import { z } from 'zod'
import { orderSchema } from '@transcendence/shared/schemas/common'
import {
    usernameField,
    emailField,
} from '@transcendence/shared/schemas/user'

export {
    usernameField,
    emailField,
    passwordField,
    registerUserSchema,
    emailSchema,
    usernameSchema,
    updateUserSchema,
} from '@transcendence/shared/schemas/user'

const argon2Regex = /^\$argon2(id?|d)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/

const passwordHashField = z.string({ error: 'Password hash is required.' })
    .regex(argon2Regex, 'Password hash must be a valid argon2 hash.')

export const userSchema = z.object({
    username: usernameField,
    email: emailField,
    passwordHash: passwordHashField,
})

export const listUsersQuerySchema = z.object({
    order: orderSchema.optional(),
    order_by: z.enum(['created_at', 'username']).optional(),
})
