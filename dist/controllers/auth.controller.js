"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../utils/helpers");
// ─── Cookie Options ───────────────────────────────────────────────────────────
// In production the frontend and backend are on different domains, so the
// refresh cookie must use SameSite=None (with Secure=true) to be sent
// cross-origin. In development SameSite=Lax is fine.
const isProduction = process.env.NODE_ENV === "production";
const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax"),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};
// ─── Register ─────────────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { firstName, lastName, email, password, role, patientProfile, doctorProfile, } = req.body;
    if (!firstName || !lastName || !email || !password) {
        throw new helpers_1.AppError("firstName, lastName, email, and password are required.", 400);
    }
    const existing = await User_1.default.findOne({ email });
    if (existing) {
        throw new helpers_1.AppError("User already exists with this email.", 400);
    }
    const user = await User_1.default.create({
        firstName,
        lastName,
        email,
        password,
        ...(role !== undefined && { role }),
        ...(patientProfile !== undefined && { patientProfile }),
        ...(doctorProfile !== undefined && { doctorProfile }),
    });
    const payload = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
    };
    const accessToken = (0, helpers_1.generateAccessToken)(payload);
    const refreshToken = (0, helpers_1.generateRefreshToken)(payload);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(201).json({
        success: true,
        accessToken,
        data: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            doctorProfile: user.doctorProfile,
            patientProfile: user.patientProfile,
        },
    });
});
// ─── Login ────────────────────────────────────────────────────────────────────
// @desc    Authenticate user and return tokens
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new helpers_1.AppError("Email and password are required.", 400);
    }
    const user = await User_1.default.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
        throw new helpers_1.AppError("Invalid email or password.", 401);
    }
    const payload = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
    };
    const accessToken = (0, helpers_1.generateAccessToken)(payload);
    const refreshToken = (0, helpers_1.generateRefreshToken)(payload);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(200).json({
        success: true,
        accessToken,
        data: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            doctorProfile: user.doctorProfile,
            patientProfile: user.patientProfile,
        },
    });
});
// ─── Refresh ──────────────────────────────────────────────────────────────────
// @desc    Issue a new access token using the HttpOnly refresh cookie
// @route   POST /api/v1/auth/refresh
// @access  Public (requires valid refresh cookie)
exports.refresh = (0, helpers_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        throw new helpers_1.AppError("Refresh token missing.", 401);
    }
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new helpers_1.AppError("JWT_REFRESH_SECRET environment variable is not set.", 500);
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, secret);
    }
    catch {
        throw new helpers_1.AppError("Invalid or expired refresh token.", 401);
    }
    const accessToken = (0, helpers_1.generateAccessToken)({
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
    });
    res.status(200).json({ success: true, accessToken });
});
// ─── Logout ───────────────────────────────────────────────────────────────────
// @desc    Clear the refresh token cookie
// @route   POST /api/v1/auth/logout
// @access  Public
exports.logout = (0, helpers_1.asyncHandler)(async (_req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });
    res
        .status(200)
        .json({ success: true, message: "Logged out successfully." });
});
//# sourceMappingURL=auth.controller.js.map