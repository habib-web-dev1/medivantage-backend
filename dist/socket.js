"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
let io = null;
/**
 * Initialises the Socket.io server and attaches it to the given HTTP server.
 * Must be called once during application bootstrap (in server.ts).
 */
function initSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, { cors: { origin: "*", credentials: true } });
    return io;
}
/**
 * Returns the singleton Socket.io server instance.
 * Throws if called before initSocket().
 */
function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized. Call initSocket first.");
    }
    return io;
}
//# sourceMappingURL=socket.js.map