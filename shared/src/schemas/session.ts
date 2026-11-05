
import { z } from 'zod'
import { emailField } from './user.ts'
import { ValidationErrorDetails as E } from '@transcendence/shared/errors/validation-error-details'

export const openSessionSchema = z.object({
    email: emailField,
    password: z.string(E.PASSWORD_REQUIRED).min(1, E.PASSWORD_REQUIRED),
})
