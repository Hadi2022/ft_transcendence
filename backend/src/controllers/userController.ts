import type { Request, Response } from 'express'

const { validateRegisterInput } = require('../services/userValidation.ts')
const { hashPassword } = require('../services/passwordService.ts')

async function registerUser(req: Request, res: Response): Promise<void> {
    const { username, password } = validateRegisterInput(req.body)
    const passwordHash = await hashPassword(password)

	// Not implemented yet: Persist the user with Prisma.
    // Never store or return plaintext passwords.
    res.status(501).json({
        error: {
            message: 'User persistence is not implemented yet'
        }
    })
}

module.exports = { registerUser }