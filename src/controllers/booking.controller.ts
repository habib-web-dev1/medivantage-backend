import { Request, Response } from "express";
import Appointment from "../models/Appointment";
import User from "../models/User";
import { asyncHandler, AppError } from "../utils/helpers";
import { getIO } from "../socket";

// ─── createAppointment ────────────────────────────────────────────────────────

/**
 * POST /appointments  (patient only)
 * Creates a new appointment and notifies the doctor via Socket.io.
 */
export const createAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const { doctorId, appointmentDate, symptoms, aiDiagnosis } = req.body as {
      doctorId?: string;
      appointmentDate?: string;
      symptoms?: string[];
      aiDiagnosis?: string;
    };

    if (!doctorId || !appointmentDate) {
      throw new AppError("doctorId and appointmentDate are required.", 400);
    }

    // Double-booking check
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      status: { $in: ["pending", "confirmed"] },
    });

    if (conflict) {
      throw new AppError("This time slot is already booked.", 409);
    }

    const appointment = await Appointment.create({
      patient: req.user!.id,
      doctor: doctorId,
      appointmentDate,
      status: "pending",
      aiDiagnostics: {
        reportedSymptoms: symptoms ?? [],
        aiSuggestedPreliminaryDiagnosis: aiDiagnosis,
      },
    });

    // Notify the doctor in real-time (non-critical — do not fail the request)
    try {
      getIO().to(doctorId).emit("notification:appointment", {
        message: "New appointment request",
        appointmentId: appointment._id,
        status: "pending",
      });
    } catch {
      // Socket notification failure should never block the booking response
    }

    res.status(201).json({ success: true, data: appointment });
  },
);

// ─── getAppointments ──────────────────────────────────────────────────────────

/**
 * GET /appointments  (patient or doctor)
 * Returns appointments for the authenticated user, sorted by date ascending.
 */
export const getAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, role } = req.user!;

    let appointments;

    if (role === "patient") {
      appointments = await Appointment.find({ patient: id })
        .populate("doctor", "firstName lastName doctorProfile")
        .sort({ appointmentDate: 1 });
    } else {
      // doctor
      appointments = await Appointment.find({ doctor: id })
        .populate("patient", "firstName lastName")
        .sort({ appointmentDate: 1 });
    }

    res.status(200).json({ success: true, data: appointments });
  },
);

// ─── updateAppointmentStatus ──────────────────────────────────────────────────

/**
 * PATCH /appointments/:id/status  (doctor only)
 * Updates the status of an appointment and notifies the patient via Socket.io.
 */
export const updateAppointmentStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body as { status?: string };

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new AppError("Appointment not found.", 404);
    }

    const allowed = ["confirmed", "cancelled", "completed"] as const;
    type AllowedStatus = (typeof allowed)[number];

    if (!status || !(allowed as readonly string[]).includes(status)) {
      throw new AppError(`Status must be one of: ${allowed.join(", ")}.`, 400);
    }

    appointment.status = status as AllowedStatus;
    await appointment.save();

    // Notify the patient in real-time (non-critical — safe to ignore on serverless)
    try {
      getIO()
        .to(appointment.patient.toString())
        .emit("notification:appointment", {
          message: "Appointment status updated",
          appointmentId: appointment._id,
          status,
        });
    } catch {
      // Socket.io not available in serverless environments
    }

    res.status(200).json({ success: true, data: appointment });
  },
);

// ─── getDoctors ───────────────────────────────────────────────────────────────

/**
 * GET /doctors  (any authenticated user)
 * Returns a list of doctors with optional filters:
 *   ?specialty=  — filter by specialization (case-insensitive)
 *   ?verified=   — "true" (default) | "false" | "all"
 *   ?active=     — "true" (default) | "false" | "all"
 */
export const getDoctors = asyncHandler(async (req: Request, res: Response) => {
  const {
    specialty,
    verified = "true",
    active = "true",
  } = req.query as Record<string, string | undefined>;

  const filter: Record<string, unknown> = { role: "doctor" };

  // verified filter
  if (verified === "true") {
    filter["doctorProfile.isVerified"] = true;
  } else if (verified === "false") {
    filter["doctorProfile.isVerified"] = { $ne: true };
  }
  // "all" → no filter on isVerified

  // active filter
  if (active === "true") {
    filter["isActive"] = true;
  } else if (active === "false") {
    filter["isActive"] = false;
  }
  // "all" → no filter on isActive

  if (specialty) {
    filter["doctorProfile.specialization"] = new RegExp(specialty, "i");
  }

  const doctors = await User.find(filter).select("-password");

  res.status(200).json({ success: true, data: doctors });
});
