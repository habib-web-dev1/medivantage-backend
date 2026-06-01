import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server | null = null;

/**
 * Initialises the Socket.io server and attaches it to the given HTTP server.
 * Must be called once during application bootstrap (in server.ts).
 */
export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, { cors: { origin: "*", credentials: true } });
  return io;
}

/**
 * Returns the singleton Socket.io server instance.
 * Throws if called before initSocket().
 */
export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocket first.");
  }
  return io;
}
