"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MedicineSchema = new mongoose_1.Schema({
    brandName: { type: String, required: true, trim: true },
    genericName: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    uses: { type: String, required: true },
    sideEffects: { type: String, required: true },
    precautions: { type: String, required: true },
}, { timestamps: true });
const Medicine = (0, mongoose_1.model)("Medicine", MedicineSchema);
exports.default = Medicine;
//# sourceMappingURL=Medicine.js.map