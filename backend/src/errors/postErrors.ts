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

export class InternalPostError extends Error {

    constructor({message = 'Internal server error',details={}}) {
        super(message,details)
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
