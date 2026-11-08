
import { z } from 'zod'
import { orderSchema } from '@transcendence/shared/schemas/common'
import { ErrorDetails as E } from '@transcendence/shared/errors/error-details'

export const listUsersQuerySchema = z.object({
    order: orderSchema.optional(),
    order_by: z.enum(['created_at', 'username'], E.INVALID_ORDER_BY).optional(),
})
