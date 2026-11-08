import type { ErrorRequestHandler } from 'express'
import { ErrorCodes } from '@transcendence/shared/errors/error-codes'
import { HttpError } from '../errors/HttpErrors.ts'

export const googleOAuthErrorHandler: ErrorRequestHandler = (
    err: Error,
    _req,
    res,
    next
) => {
    if (res.headersSent) {
        next(err)
        return
    }

    const code = err instanceof HttpError
        ? err.code
        : ErrorCodes.INTERNAL_SERVER_ERROR

    if (!(err instanceof HttpError)) {
        console.error(err)
    }

    res.redirect(303, `/login?error=${encodeURIComponent(code)}`)
}
