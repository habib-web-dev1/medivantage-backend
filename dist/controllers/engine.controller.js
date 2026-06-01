"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSymptoms = void 0;
const helpers_1 = require("../utils/helpers");
const symptomEngine_1 = require("../services/symptomEngine");
exports.analyzeSymptoms = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { symptoms } = req.body;
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
        throw new helpers_1.AppError("At least one symptom is required.", 400);
    }
    const symptomStrings = symptoms.filter((s) => typeof s === "string");
    const results = await (0, symptomEngine_1.calculateSymptomMatch)(symptomStrings);
    if (results.length === 0) {
        res.status(200).json({
            success: true,
            results: [],
            message: "No matching conditions found. Please consult a doctor.",
        });
        return;
    }
    res.status(200).json({ success: true, results });
});
//# sourceMappingURL=engine.controller.js.map