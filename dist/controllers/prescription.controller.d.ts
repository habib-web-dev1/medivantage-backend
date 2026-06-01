/**
 * POST /doctor/appointments/:id/prescription
 *
 * Issues a prescription for a confirmed/completed appointment.
 * Generates a PDF, attempts cloud upload (falls back to storing base64 in DB),
 * persists the prescription on the appointment, and notifies the patient.
 *
 * Body: { medications: Medication[], clinicalNotes?: string }
 */
export declare const issuePrescription: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * GET /doctor/appointments/:id/prescription/download
 *
 * Streams the stored PDF back to the client as a downloadable file.
 * Works for both doctors (issuer) and patients (recipient).
 */
export declare const downloadPrescription: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=prescription.controller.d.ts.map