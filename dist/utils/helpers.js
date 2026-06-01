"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.asyncHandler = asyncHandler;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ─── Token Generators ─────────────────────────────────────────────────────────
/**
 * Signs an access token with JWT_SECRET, expires in 15 minutes.
 */
function generateAccessToken(payload) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AppError("JWT_SECRET environment variable is not set", 500);
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "15m" });
}
/**
 * Signs a refresh token with JWT_REFRESH_SECRET, expires in 7 days.
 */
function generateRefreshToken(payload) {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new AppError("JWT_REFRESH_SECRET environment variable is not set", 500);
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "7d" });
}
// ─── AppError ─────────────────────────────────────────────────────────────────
/**
 * Operational error with an HTTP status code, suitable for use with
 * the global error-handling middleware.
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
        // Restore prototype chain (required when extending built-ins in TS)
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.AppError = AppError;
// ─── asyncHandler ─────────────────────────────────────────────────────────────
/**
 * Wraps an async Express RequestHandler so that any rejected promise is
 * forwarded to the next() error handler instead of causing an unhandled
 * rejection.
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=helpers.js.map