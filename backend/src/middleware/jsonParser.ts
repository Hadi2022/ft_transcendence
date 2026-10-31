
import type { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '../errors/HttpErrors.ts'



export const jsonParser = (req: Request, res: Response, next: NextFunction) => {

	if (typeof req.body !== 'string')	
		throw new BadRequestError({
				message: 'Request body must be a JSON string'
			})

	try {
		req.body = JSON.parse(req.body)
	} catch (error: any) {

		if (error instanceof SyntaxError)
			throw new BadRequestError({
				message: 'Error parsing JSON',
				details: {
					reason: error.message
				}
			})

		throw error
	}

	next()
}