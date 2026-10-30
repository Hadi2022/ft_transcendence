
import { HttpError, InternalError } from '../errors/HttpErrors.ts'
import type { Request, Response, NextFunction, ErrorRequestHandler} from "express";

const sendError = (res: Response, err: HttpError) => {

	res.status(err.statusCode).json({
		error: {
			code: err.code,
			message: err.message,
			details: err.details ?? {},
		},
	})
}

export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

	if (res.headersSent) {
		return next(err);
	}

	console.log(err)

	if (err instanceof HttpError)
		sendError(res, err)
	else
		sendError(res, new InternalError({ message: 'An unexpected error has occured' }))
	
	next()
}