import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../utils/helpers";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getJwtSecret(): string {
  return process.env.JWT_SECRET ?? "fallback_secret_key_nodes_512";
}

// @desc    Verify Bearer access token and attach decoded user to req.user
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "Authorization token missing or malformed." });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Authorization token missing." });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      getJwtSecret(),
    ) as unknown as TokenPayload;
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };
    next();
  } catch {
    res
      .status(403)
      .json({ message: "Invalid or expired token security signature." });
  }
};

// @desc    Restrict access to specific roles
export const restrictTo = (...roles: ("patient" | "doctor" | "admin")[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: "Access Denied: Insufficient cryptographic clearance.",
      });
      return;
    }
    next();
  };
};
