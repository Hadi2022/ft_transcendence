import type { RequestHandler } from 'express'
import { z } from 'zod'
import { findUserProfileById } from '../services/userService.ts'
import { BadRequestError, NotFoundError } from '../errors/HttpErrors.ts'

export const loadUser: RequestHandler = async (req, _res, next) => {

    const idSchema = z.uuid()
    const parsed = idSchema.safeParse(req.params.id)

    if (!parsed.success) {
        throw new BadRequestError({
            message: 'Invalid user ID',
            details: {
                id: 'User ID must be a valid UUID'
            }
        })
    }

    const user = await findUserProfileById(parsed.data)

    if (!user) {
        throw new NotFoundError({
            message: 'User not found'
        })
    }

    req.userResource = user

    next()
}
