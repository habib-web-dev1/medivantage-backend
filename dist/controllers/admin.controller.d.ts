/**
 * @route   GET /api/v1/admin/stats
 * @desc    Aggregate counts for the admin dashboard
 * @access  Admin
 */
export declare const getStats: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * @route   GET /api/v1/admin/analytics/disease-trends
 * @desc    Top 10 AI-suggested diagnoses from appointments in the last 30 days
 * @access  Admin
 */
export declare const getDiseaseTrends: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * @route   PATCH /api/v1/admin/doctors/:id/verify
 * @desc    Mark a doctor as verified
 * @access  Admin
 */
export declare const verifyDoctor: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * @route   GET /api/v1/admin/users
 * @desc    Paginated user list with optional role and search filters
 * @access  Admin
 */
export declare const getUsers: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * @route   PATCH /api/v1/admin/users/:id/status
 * @desc    Toggle a user's active status
 * @access  Admin
 */
export declare const toggleUserStatus: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=admin.controller.d.ts.map