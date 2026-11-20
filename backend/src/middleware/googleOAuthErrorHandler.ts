import type { ErrorRequestHandler } from 'express'
import { ErrorCodes } from '@transcendence/shared/errors/error-codes'
import { ErrorDetails } from '@transcendence/shared/errors/error-details'
import { HttpError } from '../errors/HttpErrors.ts'

export const googleOAuthErrorHandler: ErrorRequestHandler = (
    err: Error,
    _req,
    res,
    next
) => {
    if (res.headersSent) {
        return next(err)
    }

    let code: ErrorCodes = err instanceof HttpError
        ? err.code
        : ErrorCodes.INTERNAL_SERVER_ERROR

    if (
        err instanceof HttpError &&
        err.code === ErrorCodes.CONFLICT &&
        err.details.email === ErrorDetails.EMAIL_IN_USE
    ) {
        code = ErrorCodes.EMAIL_CONFLICT
    }

    if (!(err instanceof HttpError)) {
        console.error(err)
    }

    res.redirect(303, `/login?error=${encodeURIComponent(code)}`)
}
