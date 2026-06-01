"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const booking_controller_1 = require("../controllers/booking.controller");
const Appointment_1 = __importDefault(require("../models/Appointment"));
const helpers_1 = require("../utils/helpers");
const socket_1 = require("../socket");
const router = (0, express_1.Router)();
// All patient routes require authentication and patient role
router.use(auth_middleware_1.verifyToken, (0, auth_middleware_1.restrictTo)("patient"));
// GET /patient/appointments — list patient's appointments
router.get("/", booking_controller_1.getAppointments);
// POST /patient/appointments — book a new appointment
router.post("/", booking_controller_1.createAppointment);
// PATCH /patient/appointments/:id/status — patients can only cancel
router.patch("/:id/status", (0, helpers_1.asyncHandler)(async (req, res) => {
    const { status } = req.body;
    if (status !== "cancelled") {
        throw new helpers_1.AppError("Patients may only cancel appointments.", 403);
    }
    const appointment = await Appointment_1.default.findById(req.params["id"]);
    if (!appointment) {
        throw new helpers_1.AppError("Appointment not found.", 404);
    }
    // Only the owning patient can cancel
    if (appointment.patient.toString() !== req.user.id) {
        throw new helpers_1.AppError("Access denied.", 403);
    }
    if (appointment.status !== "pending") {
        throw new helpers_1.AppError("Only pending appointments can be cancelled.", 400);
    }
    appointment.status = "cancelled";
    await appointment.save();
    // Notify the doctor (non-critical)
    try {
        (0, socket_1.getIO)()
            .to(appointment.doctor.toString())
            .emit("notification:appointment", {
            message: "Appointment cancelled by patient",
            appointmentId: appointment._id,
            status: "cancelled",
        });
    }
    catch {
        // Socket failure must not block the response
    }
    res.status(200).json({ success: true, data: appointment });
}));
exports.default = router;
//# sourceMappingURL=patient.routes.js.map