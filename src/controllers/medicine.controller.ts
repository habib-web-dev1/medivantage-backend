import { Request, Response } from "express";
import Medicine from "../models/Medicine";
import { asyncHandler, AppError } from "../utils/helpers";

// ─── Get Medicines (paginated, searchable, filterable) ────────────────────────

// @desc    Get all medicines with optional search and category filter
// @route   GET /api/v1/medicines
// @access  Private (verifyToken)
export const getMedicines = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt(req.query["page"] as string) || 1);
    const limit = Math.max(1, parseInt(req.query["limit"] as string) || 12);
    const search = req.query["search"] as string | undefined;
    const category = req.query["category"] as string | undefined;

    // Build query filter
    const filter: Record<string, unknown> = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter["$or"] = [{ brandName: regex }, { genericName: regex }];
    }

    if (category) {
      filter["category"] = category;
    }

    const skip = (page - 1) * limit;

    const [medicines, total] = await Promise.all([
      Medicine.find(filter).skip(skip).limit(limit),
      Medicine.countDocuments(filter),
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
  },
);

// ─── Get Medicine By ID ───────────────────────────────────────────────────────

// @desc    Get a single medicine by ID
// @route   GET /api/v1/medicines/:id
// @access  Private (verifyToken)
export const getMedicineById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const medicine = await Medicine.findById(req.params["id"]);

    if (!medicine) {
      throw new AppError("Medicine not found", 404);
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  },
);

// ─── Create Medicine ──────────────────────────────────────────────────────────

// @desc    Create a new medicine
// @route   POST /api/v1/admin/medicines
// @access  Private (verifyToken + admin)
export const createMedicine = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const medicine = await Medicine.create(req.body);

    res.status(201).json({
      success: true,
      data: medicine,
    });
  },
);

// ─── Update Medicine ──────────────────────────────────────────────────────────

// @desc    Update an existing medicine by ID
// @route   PUT /api/v1/admin/medicines/:id
// @access  Private (verifyToken + admin)
export const updateMedicine = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params["id"],
      req.body,
      { new: true, runValidators: true },
    );

    if (!medicine) {
      throw new AppError("Medicine not found", 404);
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  },
);

// ─── Delete Medicine ──────────────────────────────────────────────────────────

// @desc    Delete a medicine by ID
// @route   DELETE /api/v1/admin/medicines/:id
// @access  Private (verifyToken + admin)
export const deleteMedicine = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const medicine = await Medicine.findByIdAndDelete(req.params["id"]);

    if (!medicine) {
      throw new AppError("Medicine not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Medicine deleted.",
    });
  },
);
