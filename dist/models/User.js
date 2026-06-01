"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// ─── Schema ───────────────────────────────────────────────────────────────────
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false, // Prevents password from being returned in API responses by default
    },
    role: {
        type: String,
        enum: ["patient", "doctor", "admin"],
        default: "patient",
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    // Patient-Specific Medical Profile (Optional embedded schema for ease of access)
    patientProfile: {
        dateOfBirth: Date,
        gender: {
            type: String,
            enum: ["Male", "Female", "Other", "Prefer not to say"],
        },
        bloodType: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        allergies: [String],
        chronicConditions: [String],
    },
    // Doctor-Specific Profile
    doctorProfile: {
        specialization: String,
        licenseNumber: String,
        experienceYears: Number,
        isVerified: {
            type: Boolean,
            default: false,
        },
        bio: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
    toJSON: {
        virtuals: true,
        transform: (_doc, ret) => {
            ret["id"] = ret["_id"].toString();
            delete ret["_id"];
            delete ret["__v"];
            return ret;
        },
    },
    toObject: { virtuals: true },
});
// ==========================================
// PRE-SAVE HOOK: Hash password before saving
// ==========================================
userSchema.pre("save", async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password"))
        return;
    const salt = await bcryptjs_1.default.genSalt(12);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
// ==========================================
// INSTANCE METHOD: Verify password match
// ==========================================
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map