import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends HttpError {
  constructor(resource = "Resource") {
    super(403, `${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends HttpError {
  constructor(message: string) {
    super(400, message);
    this.name = "ValidationError";
  }
}

export class ExternalServiceError extends HttpError {
  constructor(service: string, message?: string) {
    super(502, message ?? `${service} request failed`);
    this.name = "ExternalServiceError";
  }
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({
    error: {
      status: 404,
      message: "Not found",
    },
  });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;

  console.error(`[error] ${statusCode} ${err.message}`);
  if (statusCode >= 500) {
    console.error(err.stack);
  }

  const body: Record<string, unknown> = {
    error: {
      status: statusCode,
      message:
        statusCode === 500 ? "Internal server error" : err.message,
    },
  };

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    (body.error as Record<string, unknown>).detail = err.message;
  }

  res.status(statusCode).json(body);
}