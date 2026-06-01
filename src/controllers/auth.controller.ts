import { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  asyncHandler,
  AppError,
  TokenPayload,
} from "../utils/helpers";

// ─── Cookie Options ───────────────────────────────────────────────────────────
// In production the frontend and backend are on different domains, so the
// refresh cookie must use SameSite=None (with Secure=true) to be sent
// cross-origin. In development SameSite=Lax is fine.
const isProduction = process.env.NODE_ENV === "production";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// ─── Register ─────────────────────────────────────────────────────────────────

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      patientProfile,
      doctorProfile,
    } = req.body as Partial<
      Pick<
        IUser,
        | "firstName"
        | "lastName"
        | "email"
        | "password"
        | "role"
        | "patientProfile"
        | "doctorProfile"
      >
    >;

    if (!firstName || !lastName || !email || !password) {
      throw new AppError(
        "firstName, lastName, email, and password are required.",
        400,
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError("User already exists with this email.", 400);
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      ...(role !== undefined && { role }),
      ...(patientProfile !== undefined && { patientProfile }),
      ...(doctorProfile !== undefined && { doctorProfile }),
    });

    const payload: TokenPayload = {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      role: user.role,
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

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
  },
);

// ─── Login ────────────────────────────────────────────────────────────────────

// @desc    Authenticate user and return tokens
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      throw new AppError("Email and password are required.", 400);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      throw new AppError("Invalid email or password.", 401);
    }

    const payload: TokenPayload = {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      role: user.role,
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

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
  },
);

// ─── Refresh ──────────────────────────────────────────────────────────────────

// @desc    Issue a new access token using the HttpOnly refresh cookie
// @route   POST /api/v1/auth/refresh
// @access  Public (requires valid refresh cookie)
export const refresh = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const token: string | undefined = req.cookies?.refreshToken;

    if (!token) {
      throw new AppError("Refresh token missing.", 401);
    }

    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new AppError(
        "JWT_REFRESH_SECRET environment variable is not set.",
        500,
      );
    }

    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(token, secret) as TokenPayload;
    } catch {
      throw new AppError("Invalid or expired refresh token.", 401);
    }

    const accessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    });

    res.status(200).json({ success: true, accessToken });
  },
);

// ─── Logout ───────────────────────────────────────────────────────────────────

// @desc    Clear the refresh token cookie
// @route   POST /api/v1/auth/logout
// @access  Public
export const logout = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  },
);
