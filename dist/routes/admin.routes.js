"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const disease_controller_1 = require("../controllers/disease.controller");
const medicine_controller_1 = require("../controllers/medicine.controller");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
// All admin routes require authentication and admin role
router.use(auth_middleware_1.verifyToken, (0, auth_middleware_1.restrictTo)("admin"));
// ─── Dashboard ────────────────────────────────────────────────────────────────
// @route   GET /api/v1/admin/stats
router.get("/stats", admin_controller_1.getStats);
// ─── Analytics ────────────────────────────────────────────────────────────────
// @route   GET /api/v1/admin/analytics/disease-trends
router.get("/analytics/disease-trends", admin_controller_1.getDiseaseTrends);
// ─── Doctor management ────────────────────────────────────────────────────────
// @route   PATCH /api/v1/admin/doctors/:id/verify
router.patch("/doctors/:id/verify", admin_controller_1.verifyDoctor);
// ─── User management ─────────────────────────────────────────────────────────
// @route   GET /api/v1/admin/users
router.get("/users", admin_controller_1.getUsers);
// @route   PATCH /api/v1/admin/users/:id/status
router.patch("/users/:id/status", admin_controller_1.toggleUserStatus);
// ─── Disease management ───────────────────────────────────────────────────────
router.post("/diseases", disease_controller_1.createDisease);
router.put("/diseases/:id", disease_controller_1.updateDisease);
router.delete("/diseases/:id", disease_controller_1.deleteDisease);
// ─── Medicine management ──────────────────────────────────────────────────────
// @route   POST /api/v1/admin/medicines
router.post("/medicines", medicine_controller_1.createMedicine);
// @route   PUT /api/v1/admin/medicines/:id
router.put("/medicines/:id", medicine_controller_1.updateMedicine);
// @route   DELETE /api/v1/admin/medicines/:id
router.delete("/medicines/:id", medicine_controller_1.deleteMedicine);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map