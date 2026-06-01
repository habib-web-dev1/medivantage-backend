import { Router } from "express";
import { verifyToken, restrictTo } from "../middleware/auth.middleware";
import { analyzeSymptoms } from "../controllers/engine.controller";

const router = Router();

router.post("/analyze", verifyToken, restrictTo("patient"), analyzeSymptoms);

export default router;
