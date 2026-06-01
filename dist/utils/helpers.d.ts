import type { RequestHandler } from "express";
export interface TokenPayload {
    id: string;
    role: "patient" | "doctor" | "admin";
    email: string;
}
/**
 * Signs an access token with JWT_SECRET, expires in 15 minutes.
 */
export declare function generateAccessToken(payload: TokenPayload): string;
/**
 * Signs a refresh token with JWT_REFRESH_SECRET, expires in 7 days.
 */
export declare function generateRefreshToken(payload: TokenPayload): string;
/**
 * Operational error with an HTTP status code, suitable for use with
 * the global error-handling middleware.
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode: number);
}
/**
 * Wraps an async Express RequestHandler so that any rejected promise is
 * forwarded to the next() error handler instead of causing an unhandled
 * rejection.
 */
export declare function asyncHandler(fn: RequestHandler): RequestHandler;
//# sourceMappingURL=helpers.d.ts.map