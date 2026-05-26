import { Router } from "express";
import authRouter from "./auth.routes";
import patientRouter from "./patient.routes";
import doctorRouter from "./doctor.routes";
import adminRouter from "./admin.routes";
import engineRouter from "./engine.routes";
import medicineRouter from "./medicine.routes";
import diseaseRouter from "./disease.routes";
import { getDoctors } from "../controllers/booking.controller";

/**
 * Root API router — mounts all sub-routers under /api/v1.
 */
const router = Router();

// Public auth routes
router.use("/auth", authRouter);

// Role-scoped routes — each on its own prefix so their auth middleware
// only fires for the correct role and never blocks the other.
router.use("/patient/appointments", patientRouter);
router.use("/doctor/appointments", doctorRouter);

// Admin routes
router.use("/admin", adminRouter);

// Feature routes
router.use("/engine", engineRouter);
router.use("/medicines", medicineRouter);
router.use("/diseases", diseaseRouter);

// Doctor discovery — public, no auth required
router.get("/doctors", getDoctors);

export default router;
