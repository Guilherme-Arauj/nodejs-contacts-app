import { Request, Response, NextFunction } from "express";
import { DomainError } from "../../../domain/errors/DomainError.js";
import { ValidationError } from "../../../domain/errors/ValidatrionError.js";
import { HttpError } from "../../../domain/errors/HttpError.js";

export function ErrorHandlerMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("❌ Error:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
  });

  const t = req.t || ((key: string) => key);

  // 1. Erros de Validação do Domínio
  if (error instanceof ValidationError) {
    const message = t(`errors.${error.code}`, error.metadata);
    res.status(400).json({
      error: {
        type: "ValidationError",
        code: error.code,
        message,
        ...(error.metadata && { details: error.metadata }),
      },
    });
    return;
  }

  // 2. Erros Genéricos do Domínio
  if (error instanceof DomainError) {
    const message = t(`errors.${error.code}`, error.metadata);
    res.status(400).json({
      error: {
        type: "DomainError",
        code: error.code,
        message,
        ...(error.metadata && { details: error.metadata }),
      },
    });
    return;
  }

  // 3. Erros HTTP
  if (error instanceof HttpError) {
    const message = t(`errors.${error.code}`, error.metadata);
    res.status(error.statusCode).json({
      error: {
        type: error.name,
        code: error.code,
        message,
        ...(error.metadata && { details: error.metadata }),
      },
    });
    return;
  }

  // 4. Erros Desconhecidos (fallback)
  const message = t("errors.INTERNAL_SERVER_ERROR");
  res.status(500).json({
    error: {
      type: "InternalServerError",
      code: "INTERNAL_SERVER_ERROR",
      message,
    },
  });
}