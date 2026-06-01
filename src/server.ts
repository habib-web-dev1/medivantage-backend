import "dotenv/config";
import http from "http";
import jwt from "jsonwebtoken";
import app from "./app";
import { connectDB } from "./config/db";
import { initSocket } from "./socket";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_nodes_512";
const PORT = process.env.PORT || 5000;

// ── HTTP server ───────────────────────────────────────────────────────────────
const server = http.createServer(app);

// ── Socket.io bootstrap ───────────────────────────────────────────────────────
const io = initSocket(server);

/** JWT auth middleware — verifies the token from handshake and attaches user data. */
io.use((socket, next) => {
  const token = socket.handshake.auth["token"] as string | undefined;

  if (!token) {
    return next(new Error("Authentication token missing."));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: "patient" | "doctor" | "admin";
      email: string;
    };
    socket.data["user"] = decoded;
    next();
  } catch {
    next(new Error("Invalid or expired authentication token."));
  }
});

io.on("connection", (socket) => {
  const user = socket.data["user"] as { id: string } | undefined;
  if (user?.id) {
    // Join a private room keyed by the user's MongoDB ObjectId string
    void socket.join(user.id);
  }
});

// ── Database connection ───────────────────────────────────────────────────────
void connectDB();

// ── Start listening ───────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`MediVantage API server listening on port ${PORT}`);
});
