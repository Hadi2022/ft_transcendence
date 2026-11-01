import type { Request, Response } from 'express'

import { registerUserSchema, updateUserSchema } from '../schemas/user.ts'
import { createUser, findUserOwnProfileById, updateUser } from '../services/userService.ts'
import { BadRequestError, ConflictError, NotFoundError } from '../errors/HttpErrors.ts'
import { formatZodErrors } from '../utils/zod.ts'
import { UserEmailConflictError, UserNameConflictError, UserNotFoundError } from '../errors/userErrors.ts'
import type { AuthenticatedRequest } from '../types/express/Request.js'

async function registerUser(req: Request, res: Response): Promise<void> {
    const parsed = registerUserSchema.safeParse(req.body)

    if (!parsed.success) {
        throw new BadRequestError({
            message: 'Input contains invalid fields',
            details: formatZodErrors(parsed.error)
        })
    }

    let user

    try {
        user = await createUser(parsed.data)
    } catch (e: any) {
        
        if (e instanceof UserEmailConflictError)
            throw new ConflictError({ message: 'User already exists', details: {
                'email': 'email is in use'
            }})

        if (e instanceof UserNameConflictError)
            throw new ConflictError({ message: 'User already exists', details: {
                'username': 'username is in use'
            }})

        throw e
    }

    res.status(201).json({
        data: {
            ...user
        }
    })
}

const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {

    const user = await findUserOwnProfileById(req.user.id)

    if (!user)
        throw new NotFoundError({message: 'You do not exist! (wow!)'})

    res.status(200).json({
        data: {
            ...user
        }
    })

}

const getUserById = (req: Request, res: Response): void => {

    const user = req.userResource

    if (!user) {
        throw new NotFoundError({
            message: 'User not found'
        })
    }

    res.status(200).json({
        data: user
    })
}

const updateCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const parsed = updateUserSchema.safeParse(req.body)

    if (!parsed.success) {
        throw new BadRequestError({
            message: 'Input contains invalid fields',
            details: formatZodErrors(parsed.error)
        })
    }

    let user

    try {
        user = await updateUser(req.user.id, parsed.data)
    }
    catch (error) {
        if (error instanceof UserNotFoundError) {
            throw new NotFoundError({
                message: 'User not found'
            })
        }

        throw error
    }

    res.status(200).json({
        data: {
            ...user
        }
    })
}

export { registerUser, getCurrentUser, getUserById, updateCurrentUser }