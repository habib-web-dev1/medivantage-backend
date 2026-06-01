/**
 * @desc    Get all diseases; optionally populate suggestedMeds
 * @route   GET /api/v1/diseases
 * @access  Authenticated
 */
export declare const getDiseases: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * @desc    Create a new disease
 * @route   POST /api/v1/admin/diseases
 * @access  Admin
 */
export declare const createDisease: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * @desc    Update a disease by ID
 * @route   PUT /api/v1/admin/diseases/:id
 * @access  Admin
 */
export declare const updateDisease: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * @desc    Delete a disease by ID
 * @route   DELETE /api/v1/admin/diseases/:id
 * @access  Admin
 */
export declare const deleteDisease: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=disease.controller.d.ts.map