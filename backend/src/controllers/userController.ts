import type { Request, Response } from 'express'

import { registerUserSchema } from '../schemas/user.ts'
import { UserValidationError } from '../errors/userErrors.ts'
import { createUser } from '../services/userService.ts'

async function registerUser(req: Request, res: Response): Promise<void> {
    const parsed = registerUserSchema.safeParse(req.body)

    if (!parsed.success) {
        throw new UserValidationError(
            parsed.error.issues[0]?.message ?? 'Invalid request body'
        )
    }

    const user = await createUser(parsed.data)

    res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email
    })
}

export { registerUser }