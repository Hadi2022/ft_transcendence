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

class UserNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserNotFoundError'
    }
}

class UserConcurrencyError extends Error {
    constructor(message: string = 'Concurrent change') {
        super(message)
        this.name = 'UserConcurrencyError'
    }
}

export {
    UserValidationError,
    UserNameConflictError,
    UserEmailConflictError,
	UserNotFoundError,
    UserConcurrencyError,
}
