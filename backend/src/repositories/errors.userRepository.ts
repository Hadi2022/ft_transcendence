

export class UserAlreadyExistsError extends Error {
  constructor(
    message: string,
    public readonly field?: 'username' | 'email' | 'unknown'
  ) {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}
