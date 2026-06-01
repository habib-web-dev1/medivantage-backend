"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prescription_controller_1 = require("../controllers/prescription.controller");
const booking_controller_1 = require("../controllers/booking.controller");
const Appointment_1 = __importDefault(require("../models/Appointment"));
const helpers_1 = require("../utils/helpers");
const router = (0, express_1.Router)();
// ── Public-ish: any authenticated user can download a prescription PDF ────────
// Must be registered BEFORE the restrictTo("doctor") middleware below so that
// patients can also hit this endpoint (they are authenticated but not doctors).
router.get("/:id/prescription/download", auth_middleware_1.verifyToken, prescription_controller_1.downloadPrescription);
// ── All routes below require authentication AND doctor role ───────────────────
router.use(auth_middleware_1.verifyToken, (0, auth_middleware_1.restrictTo)("doctor"));
// GET / — list doctor's appointments
router.get("/", booking_controller_1.getAppointments);
// GET /:id — fetch a single appointment (for prescribe page)
router.get("/:id", (0, helpers_1.asyncHandler)(async (req, res) => {
    const appointment = await Appointment_1.default.findById(req.params["id"])
        .populate("patient", "firstName lastName email patientProfile")
        .populate("doctor", "firstName lastName doctorProfile");
    if (!appointment) {
        throw new helpers_1.AppError("Appointment not found.", 404);
    }
    // Doctors may only view their own appointments
    if (appointment.doctor._id.toString() !== req.user.id) {
        throw new helpers_1.AppError("Access denied.", 403);
    }
    res.status(200).json({ success: true, data: appointment });
}));
// PATCH /:id/status — approve / decline / complete
router.patch("/:id/status", booking_controller_1.updateAppointmentStatus);
// POST /:id/prescription — issue a prescription for an appointment
router.post("/:id/prescription", prescription_controller_1.issuePrescription);
exports.default = router;
//# sourceMappingURL=doctor.routes.js.map