import type { Request, Response } from 'express'

const { validateRegisterInput } = require('../services/userValidation.ts')
const { prepareUser } = require('../services/userService.ts')

async function registerUser(req: Request, res: Response): Promise<void> {
    const input = validateRegisterInput(req.body)
    const userData = await prepareUser(input)

	// Not implemented yet: Persist the user with Prisma.
    // Never store or return plaintext passwords.
    res.status(501).json({
        error: {
            message: 'User persistence is not implemented yet'
        }
    })
}

module.exports = { registerUser }