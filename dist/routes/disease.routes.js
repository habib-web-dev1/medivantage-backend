"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const disease_controller_1 = require("../controllers/disease.controller");
const router = (0, express_1.Router)();
// GET /api/v1/diseases — public, no auth required
router.get("/", disease_controller_1.getDiseases);
exports.default = router;
//# sourceMappingURL=disease.routes.js.map