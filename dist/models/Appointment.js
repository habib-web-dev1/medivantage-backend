"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appointmentSchema = new mongoose_1.default.Schema({
    patient: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    doctor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: [true, "Please specify an appointment date and time"],
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending",
    },
    // AI Pre-Assessment & Diagnostics Layer
    aiDiagnostics: {
        reportedSymptoms: [
            {
                type: String,
                trim: true,
            },
        ],
        severityAssessment: {
            type: String,
            enum: ["Low", "Moderate", "High", "Critical"],
            default: "Low",
        },
        aiSuggestedPreliminaryDiagnosis: String,
        aiConfidenceScore: {
            type: Number, // Percentage value (e.g., 85.5)
            min: 0,
            max: 100,
        },
    },
    // Doctor Clinical Notes & Final Prescription
    clinicalNotes: {
        symptomsObserved: String,
        doctorDiagnosis: String,
    },
    prescription: {
        medications: [
            {
                name: { type: String, required: true },
                dosage: { type: String, required: true }, // e.g., "500mg"
                frequency: { type: String, required: true }, // e.g., "Twice daily"
                duration: { type: String, required: true }, // e.g., "7 days"
            },
        ],
        pdfUrl: String, // Download endpoint URL
        pdfData: String, // Base64-encoded PDF stored in DB (fallback when no cloud)
        issuedAt: Date,
    },
}, {
    timestamps: true,
});
const Appointment = mongoose_1.default.model("Appointment", appointmentSchema);
exports.default = Appointment;
//# sourceMappingURL=Appointment.js.map