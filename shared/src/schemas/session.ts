
import { z } from 'zod'
import { emailField } from './user.ts'
import { ErrorDetails as E } from '@transcendence/shared/errors/error-details'

export const openSessionSchema = z.object({
    email: emailField,
    password: z.string(E.PASSWORD_REQUIRED).min(1, E.PASSWORD_REQUIRED),
})
