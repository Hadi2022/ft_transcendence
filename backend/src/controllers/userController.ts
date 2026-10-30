import type { Request, Response } from 'express'

import { registerUserSchema } from '../schemas/user.ts'
import { createUser } from '../services/userService.ts'
import { BadRequestError } from '../errors/HttpErrors.ts'
import { formatZodErrors } from '../utils/zod.ts'

async function registerUser(req: Request, res: Response): Promise<void> {
    const parsed = registerUserSchema.safeParse(req.body)

    if (!parsed.success) {
        throw new BadRequestError({
            message: 'Input contains invalid fields',
            details: formatZodErrors(parsed.error)
        })
    }

    const user = await createUser(parsed.data)

    res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email
    })
}

export { registerUser }