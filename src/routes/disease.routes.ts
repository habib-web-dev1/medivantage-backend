import { Router } from "express";
import { getDiseases } from "../controllers/disease.controller";

const router = Router();

// GET /api/v1/diseases — public, no auth required
router.get("/", getDiseases);

export default router;
