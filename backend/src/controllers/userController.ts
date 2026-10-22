import type { Request, Response } from 'express'

const { validateRegisterInput } = require('../services/userValidation.ts')
const { createUser } = require('../services/userService.ts')

async function registerUser(req: Request, res: Response): Promise<void> {
    const input = validateRegisterInput(req.body)
    const user = await createUser(input)

    res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email
    })
}

module.exports = { registerUser }