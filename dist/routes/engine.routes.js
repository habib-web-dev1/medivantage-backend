"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const engine_controller_1 = require("../controllers/engine.controller");
const router = (0, express_1.Router)();
router.post("/analyze", auth_middleware_1.verifyToken, (0, auth_middleware_1.restrictTo)("patient"), engine_controller_1.analyzeSymptoms);
exports.default = router;
//# sourceMappingURL=engine.routes.js.map