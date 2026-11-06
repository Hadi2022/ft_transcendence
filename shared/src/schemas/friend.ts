
import { z } from 'zod'
import { ErrorDetails as E } from '@transcendence/shared/errors/error-details'

export const openFriendRequestSchema = z.object({
    receiverId: z.uuid(E.INVALID_UUID)
})
