"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedicine = exports.updateMedicine = exports.createMedicine = exports.getMedicineById = exports.getMedicines = void 0;
const Medicine_1 = __importDefault(require("../models/Medicine"));
const helpers_1 = require("../utils/helpers");
// ─── Get Medicines (paginated, searchable, filterable) ────────────────────────
// @desc    Get all medicines with optional search and category filter
// @route   GET /api/v1/medicines
// @access  Private (verifyToken)
exports.getMedicines = (0, helpers_1.asyncHandler)(async (req, res) => {
    const page = Math.max(1, parseInt(req.query["page"]) || 1);
    const limit = Math.max(1, parseInt(req.query["limit"]) || 12);
    const search = req.query["search"];
    const category = req.query["category"];
    // Build query filter
    const filter = {};
    if (search) {
        const regex = new RegExp(search, "i");
        filter["$or"] = [{ brandName: regex }, { genericName: regex }];
    }
    if (category) {
        filter["category"] = category;
    }
    const skip = (page - 1) * limit;
    const [medicines, total] = await Promise.all([
        Medicine_1.default.find(filter).skip(skip).limit(limit),
        Medicine_1.default.countDocuments(filter),
    ]);
    res.status(200).json({
        success: true,
        data: medicines,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
});
// ─── Get Medicine By ID ───────────────────────────────────────────────────────
// @desc    Get a single medicine by ID
// @route   GET /api/v1/medicines/:id
// @access  Private (verifyToken)
exports.getMedicineById = (0, helpers_1.asyncHandler)(async (req, res) => {
    const medicine = await Medicine_1.default.findById(req.params["id"]);
    if (!medicine) {
        throw new helpers_1.AppError("Medicine not found", 404);
    }
    res.status(200).json({
        success: true,
        data: medicine,
    });
});
// ─── Create Medicine ──────────────────────────────────────────────────────────
// @desc    Create a new medicine
// @route   POST /api/v1/admin/medicines
// @access  Private (verifyToken + admin)
exports.createMedicine = (0, helpers_1.asyncHandler)(async (req, res) => {
    const medicine = await Medicine_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: medicine,
    });
});
// ─── Update Medicine ──────────────────────────────────────────────────────────
// @desc    Update an existing medicine by ID
// @route   PUT /api/v1/admin/medicines/:id
// @access  Private (verifyToken + admin)
exports.updateMedicine = (0, helpers_1.asyncHandler)(async (req, res) => {
    const medicine = await Medicine_1.default.findByIdAndUpdate(req.params["id"], req.body, { new: true, runValidators: true });
    if (!medicine) {
        throw new helpers_1.AppError("Medicine not found", 404);
    }
    res.status(200).json({
        success: true,
        data: medicine,
    });
});
// ─── Delete Medicine ──────────────────────────────────────────────────────────
// @desc    Delete a medicine by ID
// @route   DELETE /api/v1/admin/medicines/:id
// @access  Private (verifyToken + admin)
exports.deleteMedicine = (0, helpers_1.asyncHandler)(async (req, res) => {
    const medicine = await Medicine_1.default.findByIdAndDelete(req.params["id"]);
    if (!medicine) {
        throw new helpers_1.AppError("Medicine not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Medicine deleted.",
    });
});
//# sourceMappingURL=medicine.controller.js.map