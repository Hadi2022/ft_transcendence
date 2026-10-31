class UserValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserValidationError'
    }
}

class UserNameConflictError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserConflictError'
    }
}

class UserEmailConflictError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserConflictError'
    }
}

export {
    UserValidationError,
    UserNameConflictError,
    UserEmailConflictError,
}
