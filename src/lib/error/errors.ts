// lib/errors.ts
import { ErrorCode } from "./types";

export class AppError extends Error {
  public statusCode: number;
  public code: ErrorCode;
  public details?: unknown;
  public exposeDetails: boolean;

  constructor(
    statusCode: number,
    message: string,
    code: ErrorCode,
    options?: {
      details?: unknown;
      exposeDetails?: boolean;
    }
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = options?.details;
    this.exposeDetails = options?.exposeDetails ?? false;

    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, "VALIDATION_ERROR", {
      details,
      exposeDetails: true,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message, "FORBIDDEN");
  }
}
