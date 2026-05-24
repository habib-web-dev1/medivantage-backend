import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/index";
import { errorHandler } from "./middleware/error.middleware";
import { connectDB } from "./config/db";

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Build the allowed-origins list from env. Always include known origins.
const productionOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : [];

const allowedOrigins = [
  ...productionOrigins,
  "https://medivantage.vercel.app", // production frontend (hardcoded fallback)
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// ── DB connection middleware ───────────────────────────────────────────────────
// Ensures MongoDB is connected before any route handler runs.
// Uses a cached connection so it's a no-op on warm Vercel invocations.
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
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
app.use("/api/v1", apiRouter);

// ── Centralised error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

export default app;
