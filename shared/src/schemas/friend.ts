
import { z } from 'zod'
import { ErrorDetails as E } from '@transcendence/shared/errors/error-details'

export const openFriendRequestSchema = z.object({
    receiverId: z.uuid(E.INVALID_UUID)
})

export const acceptFriendRequestSchema = z.object({
    status: z.literal('accepted', {error: E.INVALID_VALUE})
}, {
    error: () => E.INVALID
}).strict()