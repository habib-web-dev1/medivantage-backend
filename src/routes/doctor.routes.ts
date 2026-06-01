import { Router } from "express";
import { verifyToken, restrictTo } from "../middleware/auth.middleware";
import {
  issuePrescription,
  downloadPrescription,
} from "../controllers/prescription.controller";
import {
  getAppointments,
  updateAppointmentStatus,
} from "../controllers/booking.controller";
import Appointment from "../models/Appointment";
import { asyncHandler, AppError } from "../utils/helpers";

const router = Router();

// ── Public-ish: any authenticated user can download a prescription PDF ────────
// Must be registered BEFORE the restrictTo("doctor") middleware below so that
// patients can also hit this endpoint (they are authenticated but not doctors).
router.get("/:id/prescription/download", verifyToken, downloadPrescription);

// ── All routes below require authentication AND doctor role ───────────────────
router.use(verifyToken, restrictTo("doctor"));

// GET / — list doctor's appointments
router.get("/", getAppointments);

// GET /:id — fetch a single appointment (for prescribe page)
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params["id"])
      .populate("patient", "firstName lastName email patientProfile")
      .populate("doctor", "firstName lastName doctorProfile");

    if (!appointment) {
      throw new AppError("Appointment not found.", 404);
    }

    // Doctors may only view their own appointments
    if (appointment.doctor._id.toString() !== req.user!.id) {
      throw new AppError("Access denied.", 403);
    }

    res.status(200).json({ success: true, data: appointment });
  }),
);

// PATCH /:id/status — approve / decline / complete
router.patch("/:id/status", updateAppointmentStatus);

// POST /:id/prescription — issue a prescription for an appointment
router.post("/:id/prescription", issuePrescription);

export default router;
