"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctors = exports.updateAppointmentStatus = exports.getAppointments = exports.createAppointment = void 0;
const Appointment_1 = __importDefault(require("../models/Appointment"));
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../utils/helpers");
const socket_1 = require("../socket");
// ─── createAppointment ────────────────────────────────────────────────────────
/**
 * POST /appointments  (patient only)
 * Creates a new appointment and notifies the doctor via Socket.io.
 */
exports.createAppointment = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { doctorId, appointmentDate, symptoms, aiDiagnosis } = req.body;
    if (!doctorId || !appointmentDate) {
        throw new helpers_1.AppError("doctorId and appointmentDate are required.", 400);
    }
    // Double-booking check
    const conflict = await Appointment_1.default.findOne({
        doctor: doctorId,
        appointmentDate: new Date(appointmentDate),
        status: { $in: ["pending", "confirmed"] },
    });
    if (conflict) {
        throw new helpers_1.AppError("This time slot is already booked.", 409);
    }
    const appointment = await Appointment_1.default.create({
        patient: req.user.id,
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
        (0, socket_1.getIO)().to(doctorId).emit("notification:appointment", {
            message: "New appointment request",
            appointmentId: appointment._id,
            status: "pending",
        });
    }
    catch {
        // Socket notification failure should never block the booking response
    }
    res.status(201).json({ success: true, data: appointment });
});
// ─── getAppointments ──────────────────────────────────────────────────────────
/**
 * GET /appointments  (patient or doctor)
 * Returns appointments for the authenticated user, sorted by date ascending.
 */
exports.getAppointments = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { id, role } = req.user;
    let appointments;
    if (role === "patient") {
        appointments = await Appointment_1.default.find({ patient: id })
            .populate("doctor", "firstName lastName doctorProfile")
            .sort({ appointmentDate: 1 });
    }
    else {
        // doctor
        appointments = await Appointment_1.default.find({ doctor: id })
            .populate("patient", "firstName lastName")
            .sort({ appointmentDate: 1 });
    }
    res.status(200).json({ success: true, data: appointments });
});
// ─── updateAppointmentStatus ──────────────────────────────────────────────────
/**
 * PATCH /appointments/:id/status  (doctor only)
 * Updates the status of an appointment and notifies the patient via Socket.io.
 */
exports.updateAppointmentStatus = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await Appointment_1.default.findById(id);
    if (!appointment) {
        throw new helpers_1.AppError("Appointment not found.", 404);
    }
    const allowed = ["confirmed", "cancelled", "completed"];
    if (!status || !allowed.includes(status)) {
        throw new helpers_1.AppError(`Status must be one of: ${allowed.join(", ")}.`, 400);
    }
    appointment.status = status;
    await appointment.save();
    // Notify the patient in real-time
    (0, socket_1.getIO)()
        .to(appointment.patient.toString())
        .emit("notification:appointment", {
        message: "Appointment status updated",
        appointmentId: appointment._id,
        status,
    });
    res.status(200).json({ success: true, data: appointment });
});
// ─── getDoctors ───────────────────────────────────────────────────────────────
/**
 * GET /doctors  (any authenticated user)
 * Returns a list of doctors with optional filters:
 *   ?specialty=  — filter by specialization (case-insensitive)
 *   ?verified=   — "true" (default) | "false" | "all"
 *   ?active=     — "true" (default) | "false" | "all"
 */
exports.getDoctors = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { specialty, verified = "true", active = "true", } = req.query;
    const filter = { role: "doctor" };
    // verified filter
    if (verified === "true") {
        filter["doctorProfile.isVerified"] = true;
    }
    else if (verified === "false") {
        filter["doctorProfile.isVerified"] = { $ne: true };
    }
    // "all" → no filter on isVerified
    // active filter
    if (active === "true") {
        filter["isActive"] = true;
    }
    else if (active === "false") {
        filter["isActive"] = false;
    }
    // "all" → no filter on isActive
    if (specialty) {
        filter["doctorProfile.specialization"] = new RegExp(specialty, "i");
    }
    const doctors = await User_1.default.find(filter).select("-password");
    res.status(200).json({ success: true, data: doctors });
});
//# sourceMappingURL=booking.controller.js.map