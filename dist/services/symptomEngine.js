"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSymptomMatch = void 0;
const Disease_1 = __importDefault(require("../models/Disease"));
const calculateSymptomMatch = async (inputSymptoms) => {
    const normalizedInput = inputSymptoms.map((s) => s.toLowerCase().trim());
    if (normalizedInput.length === 0)
        return [];
    const allDiseases = (await Disease_1.default.find()
        .populate("suggestedMeds")
        .lean());
    const results = [];
    for (const disease of allDiseases) {
        const diseaseSymptoms = disease.symptoms.map((s) => s.toLowerCase().trim());
        const matched = diseaseSymptoms.filter((s) => normalizedInput.includes(s));
        if (matched.length > 0) {
            const matchPercentage = Math.round((matched.length / diseaseSymptoms.length) * 100);
            results.push({
                diseaseId: disease._id.toString(),
                name: disease.name,
                probabilityMatch: matchPercentage,
                description: disease.description,
                precautions: disease.precautions,
                emergencyLevel: disease.emergencyLevel,
                suggestedMedicines: disease.suggestedMeds,
            });
        }
    }
    return results.sort((a, b) => b.probabilityMatch - a.probabilityMatch);
};
exports.calculateSymptomMatch = calculateSymptomMatch;
//# sourceMappingURL=symptomEngine.js.map