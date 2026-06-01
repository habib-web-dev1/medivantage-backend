"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
// Route: POST /api/v1/auth/register
router.post("/register", auth_controller_1.register);
// Route: POST /api/v1/auth/login
router.post("/login", auth_controller_1.login);
// Route: POST /api/v1/auth/refresh
router.post("/refresh", auth_controller_1.refresh);
// Route: POST /api/v1/auth/logout
router.post("/logout", auth_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map