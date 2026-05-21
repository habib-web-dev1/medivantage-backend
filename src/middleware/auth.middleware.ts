import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_nodes_512";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "patient" | "doctor" | "admin";
    email: string;
  };
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or malformed." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET,
    ) as AuthenticatedRequest["user"];
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired token security signature." });
  }
};

export const restrictTo = (...roles: ("patient" | "doctor" | "admin")[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: "Access Denied: Insufficient cryptographic clearance.",
        });
    }
    next();
  };
};

export const checkReadOnlyAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user && req.user.role === "admin") {
    if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
      return res.status(403).json({
        message:
          "Demo Admin Mode Restriction: This system architecture enforces read-only power.",
      });
    }
  }
  next();
};
