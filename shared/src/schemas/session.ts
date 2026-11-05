
import { z } from 'zod'
import { emailField } from './user.ts'

export const openSessionSchema = z.object({
    email: emailField,
    password: z.string().min(1, 'password required'),
})
