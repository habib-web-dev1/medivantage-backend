import express from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller";

const router = express.Router();

// Route: POST /api/v1/auth/register
router.post("/register", register);

// Route: POST /api/v1/auth/login
router.post("/login", login);

// Route: POST /api/v1/auth/refresh
router.post("/refresh", refresh);

// Route: POST /api/v1/auth/logout
router.post("/logout", logout);

export default router;
