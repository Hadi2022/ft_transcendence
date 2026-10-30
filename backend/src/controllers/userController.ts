import type { Request, Response } from 'express'

import { registerUserSchema } from '../schemas/user.ts'
import { createUser } from '../services/userService.ts'
import { BadRequestError, ConflictError, InternalError } from '../errors/HttpErrors.ts'
import { formatZodErrors } from '../utils/zod.ts'
import type { UserPublic } from '../types/user.ts'
import { UserEmailConflictError, UserNameConflictError } from '../errors/userErrors.ts'

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
                'name': 'username is in use'
            }})

        throw e
    }

    res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email
    })
}

export { registerUser }