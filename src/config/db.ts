import mongoose from "mongoose";

// ── Serverless connection cache ───────────────────────────────────────────────
// On Vercel each function invocation may reuse a warm container. Caching the
// connection avoids opening a new TCP connection on every request.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const cache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is not set.");
  }

  // Already connected — reuse
  if (cache.conn) return;

  // Connection in progress — wait for it
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false, // fail fast instead of buffering when not connected
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  }

  try {
    cache.conn = await cache.promise;
    console.log("MongoDB connected.");
  } catch (err) {
    // Reset so the next request retries
    cache.promise = null;
    throw err;
  }
}
