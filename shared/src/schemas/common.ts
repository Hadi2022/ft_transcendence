import { z } from "zod";
import { ValidationErrorDetails as E } from '@transcendence/shared/errors/validation-error-details'

export const idParamSchema = z.object({ id: z.uuid(E.INVALID_UUID) });
export const orderSchema = z.enum(['asc', 'desc'], E.INVALID_ORDER);
