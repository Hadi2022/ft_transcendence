
interface ErrorOptions {
	message?: string,
	details?: Record<string, string>,
}

export class HttpError extends Error {

	constructor(
		message: string,
		public readonly details: Record<string, string>,
		public readonly statusCode: number,
		public readonly code: string,
	) {
		super(message);

		this.name = new.target.name;
	}
}

// 400
export class BadRequestError extends HttpError {

	constructor({
			message = 'Invalid request',
			details = {}
		}: ErrorOptions
	) {
		super(message, details, 400, 'BAD_REQUEST')
	}

}

// 401
export class UnauthorizedError extends HttpError {

	constructor({
			message = 'You unauthorized to access this resource',
			details = {}
		}: ErrorOptions
	) {
		super(message, details, 401, 'UNAUTHORIZED')
	}

}

// 404
export class NotFoundError extends HttpError {

	constructor({
			message = 'Resource not found',
			details = {}
		}: ErrorOptions
	) {
		super(message, details, 404, 'NOT_FOUND')
	}

}

// 409
export class ConflictError extends HttpError {

	constructor({
			message = 'Conflict',
			details = {}
		}: ErrorOptions
	) {
		super(message, details, 409, 'CONFLICT')
	}

}

// 500
export class InternalError extends HttpError {

	constructor({
			message = 'Internal server error',
			details = {}
		}: ErrorOptions
	) {
		super(message, details, 500, 'INTERNAL')
	}

}
