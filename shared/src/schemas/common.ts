import { z } from "zod";
import { ErrorDetails as E } from '@transcendence/shared/errors/error-details'

export const idParamSchema = z.object({ id: z.uuid(E.INVALID_UUID) });
export const orderSchema = z.enum(['asc', 'desc'], E.INVALID_ORDER);
