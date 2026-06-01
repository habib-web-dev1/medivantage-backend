import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  getMedicines,
  getMedicineById,
} from "../controllers/medicine.controller";

const router = Router();

// @route   GET /api/v1/medicines
// @access  Public — no auth required for browsing
router.get("/", getMedicines);

// @route   GET /api/v1/medicines/:id
// @access  Public — no auth required for browsing
router.get("/:id", getMedicineById);

export default router;
