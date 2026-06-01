"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUserStatus = exports.getUsers = exports.verifyDoctor = exports.getDiseaseTrends = exports.getStats = void 0;
const User_1 = __importDefault(require("../models/User"));
const Appointment_1 = __importDefault(require("../models/Appointment"));
const Medicine_1 = __importDefault(require("../models/Medicine"));
const helpers_1 = require("../utils/helpers");
// ─── Dashboard Stats ──────────────────────────────────────────────────────────
/**
 * @route   GET /api/v1/admin/stats
 * @desc    Aggregate counts for the admin dashboard
 * @access  Admin
 */
exports.getStats = (0, helpers_1.asyncHandler)(async (_req, res) => {
    const [totalUsers, verifiedDoctors, pendingDoctors, totalAppointments, totalMedicines,] = await Promise.all([
        User_1.default.countDocuments({ role: { $ne: "admin" } }),
        User_1.default.countDocuments({ role: "doctor", "doctorProfile.isVerified": true }),
        User_1.default.countDocuments({ role: "doctor", "doctorProfile.isVerified": false }),
        Appointment_1.default.countDocuments(),
        Medicine_1.default.countDocuments(),
    ]);
    res.json({
        success: true,
        data: {
            totalUsers,
            verifiedDoctors,
            pendingDoctors,
            totalAppointments,
            totalMedicines,
        },
    });
});
// ─── Disease Trends ───────────────────────────────────────────────────────────
/**
 * @route   GET /api/v1/admin/analytics/disease-trends
 * @desc    Top 10 AI-suggested diagnoses from appointments in the last 30 days
 * @access  Admin
 */
exports.getDiseaseTrends = (0, helpers_1.asyncHandler)(async (_req, res) => {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const results = await Appointment_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: since },
                "aiDiagnostics.aiSuggestedPreliminaryDiagnosis": {
                    $exists: true,
                    $ne: "",
                },
            },
        },
        {
            $group: {
                _id: "$aiDiagnostics.aiSuggestedPreliminaryDiagnosis",
                matchCount: { $sum: 1 },
            },
        },
        { $sort: { matchCount: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, diseaseName: "$_id", matchCount: 1 } },
    ]);
    res.json({ success: true, data: results });
});
// ─── Doctor Verification ──────────────────────────────────────────────────────
/**
 * @route   PATCH /api/v1/admin/doctors/:id/verify
 * @desc    Mark a doctor as verified
 * @access  Admin
 */
exports.verifyDoctor = (0, helpers_1.asyncHandler)(async (req, res) => {
    const doctor = await User_1.default.findByIdAndUpdate(req.params["id"], { "doctorProfile.isVerified": true }, { new: true }).select("-password");
    if (!doctor)
        throw new helpers_1.AppError("Doctor not found.", 404);
    res.json({ success: true, data: doctor });
});
// ─── User Management ──────────────────────────────────────────────────────────
/**
 * @route   GET /api/v1/admin/users
 * @desc    Paginated user list with optional role and search filters
 * @access  Admin
 */
exports.getUsers = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { role, search } = req.query;
    const filter = {};
    if (role)
        filter["role"] = role;
    if (search) {
        filter["$or"] = [
            { firstName: new RegExp(search, "i") },
            { lastName: new RegExp(search, "i") },
            { email: new RegExp(search, "i") },
        ];
    }
    const users = await User_1.default.find(filter)
        .select("-password")
        .sort({ createdAt: -1 });
    res.json({ success: true, data: users });
});
/**
 * @route   PATCH /api/v1/admin/users/:id/status
 * @desc    Toggle a user's active status
 * @access  Admin
 */
exports.toggleUserStatus = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
        throw new helpers_1.AppError("isActive must be a boolean.", 400);
    }
    const user = await User_1.default.findByIdAndUpdate(req.params["id"], { isActive }, { new: true }).select("-password");
    if (!user)
        throw new helpers_1.AppError("User not found.", 404);
    res.json({ success: true, data: user });
});
//# sourceMappingURL=admin.controller.js.map