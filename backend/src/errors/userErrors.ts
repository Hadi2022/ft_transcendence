class UserValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserValidationError'
    }
}

class UserConflictError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserConflictError'
    }
}

module.exports = {
    UserValidationError,
    UserConflictError
}
