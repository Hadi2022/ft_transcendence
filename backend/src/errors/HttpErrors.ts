
import { ErrorCodes } from '@transcendence/shared/errors/error-codes'

interface ErrorOptions {
	message?: string,
	details?: Record<string, string>,
	code?: string
}

export class HttpError extends Error {
	public readonly details: Record<string, string>;
	public readonly statusCode: number;
	public readonly code: string;

	constructor(
		message: string,
		details: Record<string, string>,
		statusCode: number,
		code: string,
	) {
		super(message);

		this.name = new.target.name;
		this.details = details;
		this.statusCode = statusCode;
		this.code = code;
	}
}


// 400
export class BadRequestError extends HttpError {

	constructor({
			message = 'Invalid request',
			details = {},
			code = ErrorCodes.BAD_REQUEST
		}: ErrorOptions = {}
	) {
		super(message, details, 400, code)
	}

}

// 401
export class UnauthorizedError extends HttpError {

	constructor({
			message = 'You are not authorized to access this resource',
			details = {},
			code = ErrorCodes.UNAUTHORIZED
		}: ErrorOptions = {}
	) {
		super(message, details, 401, code)
	}

}

// 404
export class NotFoundError extends HttpError {

	constructor({
			message = 'Resource not found',
			details = {},
			code = ErrorCodes.NOT_FOUND
		}: ErrorOptions = {}
	) {
		super(message, details, 404, code)
	}

}

// 409
export class ConflictError extends HttpError {

	constructor({
			message = 'Conflict',
			details = {},
			code = ErrorCodes.CONFLICT
		}: ErrorOptions = {}
	) {
		super(message, details, 409, code)
	}

}

// 500
export class InternalError extends HttpError {

	constructor({
			message = 'Internal server error',
			details = {},
			code = ErrorCodes.INTERNAL_SERVER_ERROR
		}: ErrorOptions = {}
	) {
		super(message, details, 500, code)
	}

}

// 502
export class BadGatewayError extends HttpError {
	constructor({
		message = 'External authentication provider unavailable',
		details = {},
		code = ErrorCodes.BAD_GATEWAY,
  	}: ErrorOptions = {}) {
    	super(message, details, 502, code)
  	}
}
