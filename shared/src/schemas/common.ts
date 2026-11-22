import { z } from "zod";
import { ErrorDetails as E } from '@transcendence/shared/errors/error-details'

export const idParamSchema = z.object({ id: z.uuid(E.INVALID_UUID) });
export const orderSchema = z.enum(['asc', 'desc'], E.INVALID_ORDER);


const limitParam = z.coerce.number().int().min(1).max(100).default(20);
const offsetParam = z.coerce.number().int().min(0).default(0)
const userIdParamSchema = z.uuid(E.INVALID_UUID).optional()
export const queryParamsSchema = z.object({
	limit:limitParam,
	offset:offsetParam,
	userId:userIdParamSchema,
}).strict()
