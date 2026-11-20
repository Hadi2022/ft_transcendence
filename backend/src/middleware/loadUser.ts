import type { RequestHandler } from 'express'
import { idParamSchema } from '@transcendence/shared/schemas/common'
import { findUserProfileById } from '../services/userService.ts'
import { BadRequestError, NotFoundError } from '../errors/HttpErrors.ts'
import { formatZodErrors } from '../utils/zod.ts'
import { ErrorCodes } from '@transcendence/shared/errors/error-codes'

export const loadUser: RequestHandler = async (req, _res, next) => {

    const parsed = idParamSchema.safeParse(req.params)

    if (!parsed.success) {
        throw new BadRequestError({
            code: ErrorCodes.VALIDATION_ERROR,
            message: 'Invalid user ID',
            details: formatZodErrors(parsed.error)
        })
    }

	const user = await findUserProfileById(parsed.data.id)

    if (!user) {
        throw new NotFoundError({
            message: 'User not found'
        })
    }

    req.userResource = user

    next()
}
