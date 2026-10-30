

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
