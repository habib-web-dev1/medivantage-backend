import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/helpers";

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = (err as AppError).statusCode ?? 500;
  let message = err.message ?? "Internal Server Error";

  // Mongoose CastError (invalid ObjectId) → 400
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  // Mongoose ValidationError → 400 with field-level errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.entries((err as any).errors).map(([k, v]: [string, any]) => [
        k,
        v.message,
      ]),
    );
    res
      .status(400)
      .json({ success: false, message: "Validation failed.", errors });
    return;
  }

  // MongoDB duplicate key error (code 11000) → 409
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((err as any).code === 11000) {
    statusCode = 409;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const field = Object.keys((err as any).keyValue ?? {})[0] ?? "field";
    message = `Duplicate value for field: ${field}.`;
  }

  // Log in development; production logs only message + status
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  } else {
    console.error(`[${statusCode}] ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
