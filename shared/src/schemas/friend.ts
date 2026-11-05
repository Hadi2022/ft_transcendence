
import { z } from 'zod'
import { ValidationErrorDetails as E } from '@transcendence/shared/errors/validation-error-details'

export const openFriendRequestSchema = z.object({
    receiverId: z.uuid(E.INVALID_UUID)
})
