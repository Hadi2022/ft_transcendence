import type { Request, Response } from 'express'

import { registerUserSchema } from '../schemas/user.ts'
import { createUser, findUserById } from '../services/userService.ts'
import { BadRequestError, ConflictError, NotFoundError } from '../errors/HttpErrors.ts'
import { formatZodErrors } from '../utils/zod.ts'
import type { UserPublic } from '../types/user.ts'
import { UserEmailConflictError, UserNameConflictError } from '../errors/userErrors.ts'
import type { AuthenticatedRequest } from '../types/express/Request.js'

async function registerUser(req: Request, res: Response): Promise<void> {
    const parsed = registerUserSchema.safeParse(req.body)

    if (!parsed.success) {
        throw new BadRequestError({
            message: 'Input contains invalid fields',
            details: formatZodErrors(parsed.error)
        })
    }

    let user: UserPublic

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
            id: user.id,
            username: user.username,
            email: user.email
        }
    })
}

const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {

    const user = req.user

    res.status(200).json({
        data: {
            id: user.id,
            username: user.username,
            email: user.email,
        }
    })

}

export { registerUser, getCurrentUser }