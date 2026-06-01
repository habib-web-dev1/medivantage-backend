"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = exports.Medicine = exports.Disease = exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor", "admin"], required: true },
    avatar: { type: String, required: true },
});
const DiseaseSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    symptoms: [{ type: String, lowercase: true, trim: true }],
    description: { type: String, required: true },
    precautions: [{ type: String }],
    suggestedMeds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Medicine" }],
    emergencyLevel: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        required: true,
    },
});
const MedicineSchema = new mongoose_1.Schema({
    brandName: { type: String, required: true },
    genericName: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    uses: { type: String, required: true },
    sideEffects: { type: String, required: true },
    precautions: { type: String, required: true },
});
const AppointmentSchema = new mongoose_1.Schema({
    patientId: { type: mongoose_1.Schema.Types.Mixed, required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    specialty: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Declined"],
        default: "Pending",
    },
    symptomBrief: { type: String, required: true },
    prescriptionUrl: { type: String },
    dosageBrief: { type: String },
});
exports.User = (0, mongoose_1.model)("User", UserSchema);
exports.Disease = (0, mongoose_1.model)("Disease", DiseaseSchema);
exports.Medicine = (0, mongoose_1.model)("Medicine", MedicineSchema);
exports.Appointment = (0, mongoose_1.model)("Appointment", AppointmentSchema);
//# sourceMappingURL=Schemas.js.map