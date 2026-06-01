import { Router } from "express";
import { verifyToken, restrictTo } from "../middleware/auth.middleware";
import {
  createAppointment,
  getAppointments,
} from "../controllers/booking.controller";
import Appointment from "../models/Appointment";
import { asyncHandler, AppError } from "../utils/helpers";
import { getIO } from "../socket";

const router = Router();

// All patient routes require authentication and patient role
router.use(verifyToken, restrictTo("patient"));

// GET /patient/appointments — list patient's appointments
router.get("/", getAppointments);

// POST /patient/appointments — book a new appointment
router.post("/", createAppointment);

// PATCH /patient/appointments/:id/status — patients can only cancel
router.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    const { status } = req.body as { status?: string };

    if (status !== "cancelled") {
      throw new AppError("Patients may only cancel appointments.", 403);
    }

    const appointment = await Appointment.findById(req.params["id"]);
    if (!appointment) {
      throw new AppError("Appointment not found.", 404);
    }

    // Only the owning patient can cancel
    if (appointment.patient.toString() !== req.user!.id) {
      throw new AppError("Access denied.", 403);
    }

    if (appointment.status !== "pending") {
      throw new AppError("Only pending appointments can be cancelled.", 400);
    }

    appointment.status = "cancelled";
    await appointment.save();

    // Notify the doctor (non-critical)
    try {
      getIO()
        .to(appointment.doctor.toString())
        .emit("notification:appointment", {
          message: "Appointment cancelled by patient",
          appointmentId: appointment._id,
          status: "cancelled",
        });
    } catch {
      // Socket failure must not block the response
    }

    res.status(200).json({ success: true, data: appointment });
  }),
);

export default router;
