"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ─── Helpers ──────────────────────────────────────────────────────────────────
function getJwtSecret() {
    return process.env.JWT_SECRET ?? "fallback_secret_key_nodes_512";
}
// @desc    Verify Bearer access token and attach decoded user to req.user
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
            .status(401)
            .json({ message: "Authorization token missing or malformed." });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Authorization token missing." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, getJwtSecret());
        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.email,
        };
        next();
    }
    catch {
        res
            .status(403)
            .json({ message: "Invalid or expired token security signature." });
    }
};
exports.verifyToken = verifyToken;
// @desc    Restrict access to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                message: "Access Denied: Insufficient cryptographic clearance.",
            });
            return;
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=auth.middleware.js.map