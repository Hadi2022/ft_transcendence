import type { Request, Response } from 'express'

const { validateRegisterInput } = require('../services/userValidation.ts')
const { createUser } = require('../services/userService.ts')
const { UserValidationError, UserConflictError } = require('../errors/userErrors.ts')

async function registerUser(req: Request, res: Response): Promise<void> {
    try {
        const input = validateRegisterInput(req.body)
        const user = await createUser(input)

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email
        })
    } catch (error: unknown) {
		if (error instanceof Error && error instanceof UserValidationError) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
            return
        }

		if (error instanceof Error && error instanceof UserConflictError) {
            res.status(409).json({
                error: {
                    message: error.message
                }
            })
            return
        }

        console.error('Registration error:', error)

        res.status(500).json({
            error: {
                message: 'Internal server error'
            }
        })
    }
}

module.exports = { registerUser }
