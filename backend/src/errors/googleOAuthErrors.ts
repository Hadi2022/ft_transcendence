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

export class GoogleAuthError extends Error {

    public readonly code: 'EMAIL_NOT_VERIFIED' | 'EMAIL_MISSING' | 'EMAIL_CONFLICT' | 'GOOGLE_ACCOUNT_EXISTS';
    constructor(message: string, code:'EMAIL_NOT_VERIFIED' | 'EMAIL_MISSING' | 'EMAIL_CONFLICT' | 'GOOGLE_ACCOUNT_EXISTS') {
        super(message);
        this.name = 'GoogleAuthError';
        this.code = code;
  }
}
