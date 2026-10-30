
import { z } from 'zod'

export const openSessionSchema = z.object({
  identifier: z.string({error: 'Identifier must be a string'}).min(1, {error: 'username or email required'}),
  password: z.string({error: 'Password must be a string'}).min(1, {error: 'password required'}),
})