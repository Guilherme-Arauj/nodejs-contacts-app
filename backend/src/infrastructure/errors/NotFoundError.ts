import { HttpError } from "../../domain/errors/HttpError.js";

export class NotFoundError extends HttpError {
  constructor(code: string = "RESOURCE_NOT_FOUND", metadata?: Record<string, any>) {
    super(404, code, metadata);
    this.name = "NotFoundError";
  }
}