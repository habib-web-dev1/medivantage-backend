"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = __importDefault(require("./routes/index"));
const error_middleware_1 = require("./middleware/error.middleware");
const db_1 = require("./config/db");
const app = (0, express_1.default)();
// ── CORS ──────────────────────────────────────────────────────────────────────
// Build the allowed-origins list from env. Always include localhost for local dev.
const productionOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
    : [];
const allowedOrigins = [
    ...productionOrigins,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, curl, server-to-server)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// ── DB connection middleware ───────────────────────────────────────────────────
// Ensures MongoDB is connected before any route handler runs.
// Uses a cached connection so it's a no-op on warm Vercel invocations.
app.use(async (_req, res, next) => {
    try {
        await (0, db_1.connectDB)();
        next();
    }
    catch (err) {
        console.error("DB connection failed:", err);
        res.status(503).json({ message: "Database unavailable. Please retry." });
    }
});
// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
// ── Root route ────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
    res.status(200).json({
        name: "MediVantage API",
        version: "1.0.0",
        status: "running",
        docs: "/api/v1/health",
    });
});
// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/v1", index_1.default);
// ── Centralised error handler (must be last) ──────────────────────────────────
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map