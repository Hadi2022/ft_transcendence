export class PostNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'PostNotFoundError'
    }
}

export class ForbiddenAccessPostError extends Error {

    constructor( message = 'You are not authorized to access this resource',) {
        super(message)
    }

}
