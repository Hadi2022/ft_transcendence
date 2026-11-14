
import { HttpError, InternalError } from '../errors/HttpErrors.ts'
import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { RepositoryError } from '../errors/RepositoryErrors.ts';

const sendErrorResponse = (
	res: Response,
	err: { statusCode: number; code: string; message: string; details?: any }
) => {
	return res.status(err.statusCode).json({
		error: {
			code: err.code,
			message: err.message,
			details: err.details ?? {},
		},
	});
};

export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

	if (res.headersSent) {
		return next(err);
	}

	console.log(err)

	if (err instanceof HttpError || err instanceof RepositoryError) {
		return sendErrorResponse(res, err);
	}
	return sendErrorResponse(res, new InternalError());
}
