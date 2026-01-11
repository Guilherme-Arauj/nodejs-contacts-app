export class DomainError extends Error {
  public readonly code: string;
  public readonly metadata?: Record<string, any>;

  constructor(code: string, metadata?: Record<string, any>) {
    super(code);
    this.name = "DomainError";
    this.code = code;
    this.metadata = metadata;
    
    Error.captureStackTrace(this, this.constructor);
  }
}