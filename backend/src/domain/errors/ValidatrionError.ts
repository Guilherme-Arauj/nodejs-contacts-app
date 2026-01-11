import { DomainError } from "./DomainError.js";

export class ValidationError extends DomainError {
  constructor(code: string, metadata?: Record<string, any>) {
    super(code, metadata);
    this.name = "ValidationError";
  }
}