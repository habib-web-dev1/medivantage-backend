"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const socket_1 = require("./socket");
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_nodes_512";
const PORT = process.env.PORT || 5000;
// ── HTTP server ───────────────────────────────────────────────────────────────
const server = http_1.default.createServer(app_1.default);
// ── Socket.io bootstrap ───────────────────────────────────────────────────────
const io = (0, socket_1.initSocket)(server);
/** JWT auth middleware — verifies the token from handshake and attaches user data. */
io.use((socket, next) => {
    const token = socket.handshake.auth["token"];
    if (!token) {
        return next(new Error("Authentication token missing."));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        socket.data["user"] = decoded;
        next();
    }
    catch {
        next(new Error("Invalid or expired authentication token."));
    }
});
io.on("connection", (socket) => {
    const user = socket.data["user"];
    if (user?.id) {
        // Join a private room keyed by the user's MongoDB ObjectId string
        void socket.join(user.id);
    }
});
// ── Database connection ───────────────────────────────────────────────────────
void (0, db_1.connectDB)();
// ── Start listening ───────────────────────────────────────────────────────────
server.listen(PORT, () => {
    console.log(`MediVantage API server listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map