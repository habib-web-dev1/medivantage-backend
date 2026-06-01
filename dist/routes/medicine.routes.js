"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicine_controller_1 = require("../controllers/medicine.controller");
const router = (0, express_1.Router)();
// @route   GET /api/v1/medicines
// @access  Public — no auth required for browsing
router.get("/", medicine_controller_1.getMedicines);
// @route   GET /api/v1/medicines/:id
// @access  Public — no auth required for browsing
router.get("/:id", medicine_controller_1.getMedicineById);
exports.default = router;
//# sourceMappingURL=medicine.routes.js.map