import { Router } from "express";
import { verifyToken, restrictTo } from "../middleware/auth.middleware";
import {
  createDisease,
  updateDisease,
  deleteDisease,
} from "../controllers/disease.controller";
import {
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicine.controller";
import {
  getStats,
  getDiseaseTrends,
  verifyDoctor,
  getUsers,
  toggleUserStatus,
} from "../controllers/admin.controller";

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyToken, restrictTo("admin"));

// ─── Dashboard ────────────────────────────────────────────────────────────────

// @route   GET /api/v1/admin/stats
router.get("/stats", getStats);

// ─── Analytics ────────────────────────────────────────────────────────────────

// @route   GET /api/v1/admin/analytics/disease-trends
router.get("/analytics/disease-trends", getDiseaseTrends);

// ─── Doctor management ────────────────────────────────────────────────────────

// @route   PATCH /api/v1/admin/doctors/:id/verify
router.patch("/doctors/:id/verify", verifyDoctor);

// ─── User management ─────────────────────────────────────────────────────────

// @route   GET /api/v1/admin/users
router.get("/users", getUsers);

// @route   PATCH /api/v1/admin/users/:id/status
router.patch("/users/:id/status", toggleUserStatus);

// ─── Disease management ───────────────────────────────────────────────────────
router.post("/diseases", createDisease);
router.put("/diseases/:id", updateDisease);
router.delete("/diseases/:id", deleteDisease);

// ─── Medicine management ──────────────────────────────────────────────────────

// @route   POST /api/v1/admin/medicines
router.post("/medicines", createMedicine);

// @route   PUT /api/v1/admin/medicines/:id
router.put("/medicines/:id", updateMedicine);

// @route   DELETE /api/v1/admin/medicines/:id
router.delete("/medicines/:id", deleteMedicine);

export default router;
