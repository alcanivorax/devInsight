import { NextResponse } from "next/server";
import { AppError } from "./errors";
import type { ErrorResponse } from "./types";
import type { ErrorCode } from "./types";
import { ERROR_CODES } from "./types";

export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  const isDev = process.env.NODE_ENV === "development";

  let statusCode = 500;
  let code: ErrorCode = ERROR_CODES.INTERNAL;
  let message = "An unexpected error occurred";
  let details: unknown;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;

    if (error.exposeDetails) {
      details = error.details;
    }
  } else if (error instanceof Error && isDev) {
    message = error.message;
  }

  console.error("API Error:", {
    code,
    message,
    statusCode,
    ...(isDev && error instanceof Error && { stack: error.stack }),
  });

  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      timestamp: new Date().toISOString(),
      ...(details !== undefined ? { details } : {}),
      ...(isDev && error instanceof Error && { stack: error.stack }),
    },
  };

  return NextResponse.json(response, { status: statusCode });
}
