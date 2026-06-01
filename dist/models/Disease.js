"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DiseaseSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    symptoms: [{ type: String, lowercase: true, trim: true }],
    description: { type: String, required: true },
    precautions: [{ type: String }],
    suggestedMeds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Medicine" }],
    emergencyLevel: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        required: true,
    },
}, { timestamps: true });
const Disease = (0, mongoose_1.model)("Disease", DiseaseSchema);
exports.default = Disease;
//# sourceMappingURL=Disease.js.map