import { Request, Response } from "express";
import { asyncHandler, AppError } from "../utils/helpers";
import { calculateSymptomMatch } from "../services/symptomEngine";

export const analyzeSymptoms = asyncHandler(
  async (req: Request, res: Response) => {
    const { symptoms } = req.body as { symptoms?: unknown };

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      throw new AppError("At least one symptom is required.", 400);
    }

    const symptomStrings = symptoms.filter(
      (s): s is string => typeof s === "string",
    );
    const results = await calculateSymptomMatch(symptomStrings);

    if (results.length === 0) {
      res.status(200).json({
        success: true,
        results: [],
        message: "No matching conditions found. Please consult a doctor.",
      });
      return;
    }

    res.status(200).json({ success: true, results });
  },
);
