export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly metadata?: Record<string, any>;

  constructor(
    statusCode: number,
    code: string,
    metadata?: Record<string, any>
  ) {
    super(code);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    this.metadata = metadata;
    
    Error.captureStackTrace(this, this.constructor);
  }
}