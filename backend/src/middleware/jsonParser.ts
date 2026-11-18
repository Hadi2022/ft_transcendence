
import type { NextFunction, Request, Response } from 'express'
import { BadRequestError, PayloadTooLargeError } from '../errors/HttpErrors.ts'

export const syntaxErrorParser = (err: Error, req: Request, res: Response, next: NextFunction) => {

	if (err instanceof SyntaxError && 'type' in err && err.type == 'entity.parse.failed')
		throw new BadRequestError({
			message: 'Error parsing JSON',
		})

    if ('type' in err && err.type == 'entity.too.large')
        throw new PayloadTooLargeError({
            message: 'JSON payload too large',
        })

	throw err
}