
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

export class RecordNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'RecordNotFoundError'
    }
}

export class GenericConstraintError extends Error {
    constructor(message: string) {
        super(message)
        this.name = new.target.name
    }
}