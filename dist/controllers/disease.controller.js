"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDisease = exports.updateDisease = exports.createDisease = exports.getDiseases = void 0;
const Disease_1 = __importDefault(require("../models/Disease"));
const helpers_1 = require("../utils/helpers");
// ─── GET /diseases ────────────────────────────────────────────────────────────
/**
 * @desc    Get all diseases; optionally populate suggestedMeds
 * @route   GET /api/v1/diseases
 * @access  Authenticated
 */
exports.getDiseases = (0, helpers_1.asyncHandler)(async (req, res) => {
    const query = Disease_1.default.find();
    if (req.query["populate"] === "suggestedMeds") {
        query.populate("suggestedMeds");
    }
    const diseases = await query;
    res.status(200).json({ success: true, data: diseases });
});
// ─── POST /admin/diseases ─────────────────────────────────────────────────────
/**
 * @desc    Create a new disease
 * @route   POST /api/v1/admin/diseases
 * @access  Admin
 */
exports.createDisease = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { name, symptoms, description, emergencyLevel, suggestedMeds } = req.body;
    // Field-level validation
    const errors = {};
    if (!name || typeof name !== "string" || name.trim() === "") {
        errors["name"] = "name is required.";
    }
    if (!symptoms ||
        !Array.isArray(symptoms) ||
        symptoms.length === 0) {
        errors["symptoms"] = "symptoms must be a non-empty array.";
    }
    if (!description ||
        typeof description !== "string" ||
        description.trim() === "") {
        errors["description"] = "description is required.";
    }
    if (!emergencyLevel ||
        !["low", "medium", "high", "critical"].includes(emergencyLevel)) {
        errors["emergencyLevel"] =
            "emergencyLevel must be one of: low, medium, high, critical.";
    }
    if (!suggestedMeds ||
        !Array.isArray(suggestedMeds) ||
        suggestedMeds.length === 0) {
        errors["suggestedMeds"] =
            "suggestedMeds must contain at least one entry.";
    }
    if (Object.keys(errors).length > 0) {
        res
            .status(400)
            .json({ success: false, message: "Validation failed", errors });
        return;
    }
    const disease = await Disease_1.default.create(req.body);
    res.status(201).json({ success: true, data: disease });
});
// ─── PUT /admin/diseases/:id ──────────────────────────────────────────────────
/**
 * @desc    Update a disease by ID
 * @route   PUT /api/v1/admin/diseases/:id
 * @access  Admin
 */
exports.updateDisease = (0, helpers_1.asyncHandler)(async (req, res) => {
    const disease = await Disease_1.default.findByIdAndUpdate(req.params["id"], req.body, { new: true, runValidators: true });
    if (!disease) {
        throw new helpers_1.AppError("Disease not found.", 404);
    }
    res.status(200).json({ success: true, data: disease });
});
// ─── DELETE /admin/diseases/:id ───────────────────────────────────────────────
/**
 * @desc    Delete a disease by ID
 * @route   DELETE /api/v1/admin/diseases/:id
 * @access  Admin
 */
exports.deleteDisease = (0, helpers_1.asyncHandler)(async (req, res) => {
    const disease = await Disease_1.default.findByIdAndDelete(req.params["id"]);
    if (!disease) {
        throw new helpers_1.AppError("Disease not found.", 404);
    }
    res.status(200).json({ success: true, message: "Disease deleted." });
});
//# sourceMappingURL=disease.controller.js.map