import User from "../models/User";
import Appointment from "../models/Appointment";
import Medicine from "../models/Medicine";
import { asyncHandler, AppError } from "../utils/helpers";

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

/**
 * @route   GET /api/v1/admin/stats
 * @desc    Aggregate counts for the admin dashboard
 * @access  Admin
 */
export const getStats = asyncHandler(async (_req, res) => {
  const [
    totalUsers,
    verifiedDoctors,
    pendingDoctors,
    totalAppointments,
    totalMedicines,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: "admin" } }),
    User.countDocuments({ role: "doctor", "doctorProfile.isVerified": true }),
    User.countDocuments({ role: "doctor", "doctorProfile.isVerified": false }),
    Appointment.countDocuments(),
    Medicine.countDocuments(),
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
export const getDiseaseTrends = asyncHandler(async (_req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const results = await Appointment.aggregate([
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
export const verifyDoctor = asyncHandler(async (req, res) => {
  const doctor = await User.findByIdAndUpdate(
    req.params["id"],
    { "doctorProfile.isVerified": true },
    { new: true },
  ).select("-password");

  if (!doctor) throw new AppError("Doctor not found.", 404);

  res.json({ success: true, data: doctor });
});

// ─── User Management ──────────────────────────────────────────────────────────

/**
 * @route   GET /api/v1/admin/users
 * @desc    Paginated user list with optional role and search filters
 * @access  Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query as Record<string, string | undefined>;

  const filter: Record<string, unknown> = {};
  if (role) filter["role"] = role;
  if (search) {
    filter["$or"] = [
      { firstName: new RegExp(search, "i") },
      { lastName: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
    ];
  }

  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: users });
});

/**
 * @route   PATCH /api/v1/admin/users/:id/status
 * @desc    Toggle a user's active status
 * @access  Admin
 */
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body as { isActive?: boolean };

  if (typeof isActive !== "boolean") {
    throw new AppError("isActive must be a boolean.", 400);
  }

  const user = await User.findByIdAndUpdate(
    req.params["id"],
    { isActive },
    { new: true },
  ).select("-password");

  if (!user) throw new AppError("User not found.", 404);

  res.json({ success: true, data: user });
});
