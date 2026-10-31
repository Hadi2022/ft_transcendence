
import type { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '../errors/HttpErrors.ts'

export const syntaxErrorParser = (err: Error, req: Request, res: Response, next: NextFunction) => {

	if (err instanceof SyntaxError && 'type' in err && err.type == 'entity.parse.failed')
		throw new BadRequestError({
			message: 'Error parsing JSON',
			details: {
				reason: err.message
			}
		})

	throw err
}