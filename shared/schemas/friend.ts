
import { z } from 'zod'

export const openFriendRequestSchema = z.object({
    receiverId: z.uuid('User id has to be valid UUID')
})

export const acceptFriendRequestSchema = z.object({
    status: z.literal('accepted')
}).strict()
