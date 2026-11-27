import { z } from "zod";
import { ErrorDetails as E } from '@transcendence/shared/errors/error-details'

export const idParamSchema = z.object({ id: z.uuid(E.INVALID_UUID) });
export const orderSchema = z.enum(['asc', 'desc'], E.INVALID_ORDER);


const unsignedIntParam = (defaultValue: number) =>
  z
    .string()
    .regex(/^\d+$/, E.INVALID_VALUE)
    .transform(Number)
    .default(defaultValue)

const limitParam = unsignedIntParam(20).pipe(z.number().min(1).max(100))
const offsetParam = unsignedIntParam(0).pipe(z.number().min(0))
const userIdParamSchema = z.uuid(E.INVALID_UUID).optional()

export const pathParamsSchema = z.object({
limit:limitParam,
	offset:offsetParam,
}).strict()

export const queryParamsSchema = z.object({
	limit:limitParam,
	offset:offsetParam,
	userId:userIdParamSchema,
}).strict()
