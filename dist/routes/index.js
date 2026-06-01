"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const patient_routes_1 = __importDefault(require("./patient.routes"));
const doctor_routes_1 = __importDefault(require("./doctor.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const engine_routes_1 = __importDefault(require("./engine.routes"));
const medicine_routes_1 = __importDefault(require("./medicine.routes"));
const disease_routes_1 = __importDefault(require("./disease.routes"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const booking_controller_1 = require("../controllers/booking.controller");
/**
 * Root API router — mounts all sub-routers under /api/v1.
 */
const router = (0, express_1.Router)();
// Public auth routes
router.use("/auth", auth_routes_1.default);
// Role-scoped routes — each on its own prefix so their auth middleware
// only fires for the correct role and never blocks the other.
router.use("/patient/appointments", patient_routes_1.default);
router.use("/doctor/appointments", doctor_routes_1.default);
// Admin routes
router.use("/admin", admin_routes_1.default);
// Feature routes
router.use("/engine", engine_routes_1.default);
router.use("/medicines", medicine_routes_1.default);
router.use("/diseases", disease_routes_1.default);
// Doctor discovery — any authenticated user
router.get("/doctors", auth_middleware_1.verifyToken, booking_controller_1.getDoctors);
exports.default = router;
//# sourceMappingURL=index.js.map