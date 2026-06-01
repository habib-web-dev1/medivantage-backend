/**
 * POST /appointments  (patient only)
 * Creates a new appointment and notifies the doctor via Socket.io.
 */
export declare const createAppointment: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * GET /appointments  (patient or doctor)
 * Returns appointments for the authenticated user, sorted by date ascending.
 */
export declare const getAppointments: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * PATCH /appointments/:id/status  (doctor only)
 * Updates the status of an appointment and notifies the patient via Socket.io.
 */
export declare const updateAppointmentStatus: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * GET /doctors  (any authenticated user)
 * Returns a list of doctors with optional filters:
 *   ?specialty=  — filter by specialization (case-insensitive)
 *   ?verified=   — "true" (default) | "false" | "all"
 *   ?active=     — "true" (default) | "false" | "all"
 */
export declare const getDoctors: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=booking.controller.d.ts.map