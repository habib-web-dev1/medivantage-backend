import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
/**
 * Initialises the Socket.io server and attaches it to the given HTTP server.
 * Must be called once during application bootstrap (in server.ts).
 */
export declare function initSocket(httpServer: HttpServer): Server;
/**
 * Returns the singleton Socket.io server instance.
 * Throws if called before initSocket().
 */
export declare function getIO(): Server;
//# sourceMappingURL=socket.d.ts.map