
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
			code = 'BAD_REQUEST'
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
			code = 'UNAUTHORIZED'
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
			code = 'NOT_FOUND'
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
			code = 'CONFLICT'
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
			code = 'INTERNAL'
		}: ErrorOptions = {}
	) {
		super(message, details, 500, code)
	}

}
