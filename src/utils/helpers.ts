import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction, RequestHandler } from "express";

// ─── Token Payload ────────────────────────────────────────────────────────────

export interface TokenPayload {
  id: string;
  role: "patient" | "doctor" | "admin";
  email: string;
}

// ─── Token Generators ─────────────────────────────────────────────────────────

/**
 * Signs an access token with JWT_SECRET, expires in 15 minutes.
 */
export function generateAccessToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("JWT_SECRET environment variable is not set", 500);
  }
  return jwt.sign(payload, secret, { expiresIn: "15m" });
}

/**
 * Signs a refresh token with JWT_REFRESH_SECRET, expires in 7 days.
 */
export function generateRefreshToken(payload: TokenPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new AppError(
      "JWT_REFRESH_SECRET environment variable is not set",
      500,
    );
  }
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

// ─── AppError ─────────────────────────────────────────────────────────────────

/**
 * Operational error with an HTTP status code, suitable for use with
 * the global error-handling middleware.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    // Restore prototype chain (required when extending built-ins in TS)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── asyncHandler ─────────────────────────────────────────────────────────────

/**
 * Wraps an async Express RequestHandler so that any rejected promise is
 * forwarded to the next() error handler instead of causing an unhandled
 * rejection.
 */
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
