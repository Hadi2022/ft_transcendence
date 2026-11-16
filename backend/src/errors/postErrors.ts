export class PostNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'PostNotFoundError'
    }
}

export class ForbiddenAccessPostError extends Error {

    constructor(message = 'You are not authorized to access this resource',) {
        super(message)
    }

}

interface InternalPostErrorOptions{
    message?: string;
    details?: string;
    filePath?: string;
}

export class InternalPostError extends Error {

    public readonly details?: string;
    public readonly filePath?: string;

    constructor({
        message = 'Internal server error',
        details= '',
        filePath= '',
    }:InternalPostErrorOptions={}) {
        super(message);
        this.name='InternalPostError';
        this.details = details;
        this.filePath=filePath;

    }

}

export class ConflictPostError extends Error {

    constructor(message = 'Conflict') {
        super(message)
    }

}

export class BadRequestPostsError extends Error {

    constructor(message = 'Invalid request') {
        super(message)
    }

}
