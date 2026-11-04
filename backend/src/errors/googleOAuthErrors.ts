export class GoogleInvalidCredentialsError extends Error {
    constructor() {
        super('Google credentials are invalid')
        this.name = new.target.name
    }
}

export class GoogleProviderError extends Error {
    constructor() {
        super('Google authentication provider failed')
        this.name = new.target.name
    }
}