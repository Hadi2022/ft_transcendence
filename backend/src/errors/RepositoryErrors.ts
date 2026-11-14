import { ErrorCodes } from "@transcendence/shared/errors/error-codes";
import type { ErrorDetails } from "@transcendence/shared/errors/error-details";

interface ErrorOptions {
	message?: string,
	details?: Record<string, ErrorDetails>,
	code?: ErrorCodes
}

export class RepositoryError extends Error {
    public readonly details: Record<string, ErrorDetails>;
    public readonly statusCode: number;
    public readonly code: ErrorCodes;

    constructor(
        message: string,
        details: Record<string, ErrorDetails>,
        statusCode: number,
        code: ErrorCodes,
    ) {
        super(message);

        this.name = new.target.name;
        this.details = details;
        this.statusCode = statusCode;
        this.code = code;
    }
}

export class UniqueConstraintError extends Error {

  public readonly field?: string | undefined;
  constructor(
    message: string,
    field?:string)
    {
    super(message);
    this.name = 'UniqueConstraintError';
    this.field = field;
  }
}

export class RecordNotFoundError extends RepositoryError {
    constructor({
         message = 'Record not found',
         details = {},
         code = ErrorCodes.NOT_FOUND
        }: ErrorOptions = {}
    ) {
        super(message, details ,404, code)
        this.name = 'RecordNotFoundError'
    }
}

export class GenericConstraintError extends Error {
    constructor(message: string) {
        super(message)
        this.name = new.target.name
    }
}
