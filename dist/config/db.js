"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const cache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;
async function connectDB() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI environment variable is not set.");
    }
    // Already connected — reuse
    if (cache.conn)
        return;
    // Connection in progress — wait for it
    if (!cache.promise) {
        cache.promise = mongoose_1.default.connect(uri, {
            bufferCommands: false, // fail fast instead of buffering when not connected
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
    }
    try {
        cache.conn = await cache.promise;
        console.log("MongoDB connected.");
    }
    catch (err) {
        // Reset so the next request retries
        cache.promise = null;
        throw err;
    }
}
//# sourceMappingURL=db.js.map