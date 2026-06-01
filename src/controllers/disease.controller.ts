import { Request, Response } from "express";
import Disease from "../models/Disease";
import { asyncHandler, AppError } from "../utils/helpers";

// ─── GET /diseases ────────────────────────────────────────────────────────────

/**
 * @desc    Get all diseases; optionally populate suggestedMeds
 * @route   GET /api/v1/diseases
 * @access  Authenticated
 */
export const getDiseases = asyncHandler(async (req: Request, res: Response) => {
  const query = Disease.find();

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
export const createDisease = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, symptoms, description, emergencyLevel, suggestedMeds } =
      req.body as {
        name?: unknown;
        symptoms?: unknown;
        description?: unknown;
        emergencyLevel?: unknown;
        suggestedMeds?: unknown;
      };

    // Field-level validation
    const errors: Record<string, string> = {};

    if (!name || typeof name !== "string" || name.trim() === "") {
      errors["name"] = "name is required.";
    }

    if (
      !symptoms ||
      !Array.isArray(symptoms) ||
      (symptoms as unknown[]).length === 0
    ) {
      errors["symptoms"] = "symptoms must be a non-empty array.";
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      errors["description"] = "description is required.";
    }

    if (
      !emergencyLevel ||
      !["low", "medium", "high", "critical"].includes(emergencyLevel as string)
    ) {
      errors["emergencyLevel"] =
        "emergencyLevel must be one of: low, medium, high, critical.";
    }

    if (
      !suggestedMeds ||
      !Array.isArray(suggestedMeds) ||
      (suggestedMeds as unknown[]).length === 0
    ) {
      errors["suggestedMeds"] =
        "suggestedMeds must contain at least one entry.";
    }

    if (Object.keys(errors).length > 0) {
      res
        .status(400)
        .json({ success: false, message: "Validation failed", errors });
      return;
    }

    const disease = await Disease.create(req.body);

    res.status(201).json({ success: true, data: disease });
  },
);

// ─── PUT /admin/diseases/:id ──────────────────────────────────────────────────

/**
 * @desc    Update a disease by ID
 * @route   PUT /api/v1/admin/diseases/:id
 * @access  Admin
 */
export const updateDisease = asyncHandler(
  async (req: Request, res: Response) => {
    const disease = await Disease.findByIdAndUpdate(
      req.params["id"],
      req.body,
      { new: true, runValidators: true },
    );

    if (!disease) {
      throw new AppError("Disease not found.", 404);
    }

    res.status(200).json({ success: true, data: disease });
  },
);

// ─── DELETE /admin/diseases/:id ───────────────────────────────────────────────

/**
 * @desc    Delete a disease by ID
 * @route   DELETE /api/v1/admin/diseases/:id
 * @access  Admin
 */
export const deleteDisease = asyncHandler(
  async (req: Request, res: Response) => {
    const disease = await Disease.findByIdAndDelete(req.params["id"]);

    if (!disease) {
      throw new AppError("Disease not found.", 404);
    }

    res.status(200).json({ success: true, message: "Disease deleted." });
  },
);
