import type { Request, Response } from "express";
import Appointment from "../models/Appointment";
import type { IUser } from "../models/User";
import { asyncHandler, AppError } from "../utils/helpers";
import { generatePrescriptionPdf } from "../services/pdfGenerator";
import { uploadToCloud } from "../services/cloudStorage";
import { getIO } from "../socket";

// ─── Issue Prescription ───────────────────────────────────────────────────────

/**
 * POST /doctor/appointments/:id/prescription
 *
 * Issues a prescription for a confirmed/completed appointment.
 * Generates a PDF, attempts cloud upload (falls back to storing base64 in DB),
 * persists the prescription on the appointment, and notifies the patient.
 *
 * Body: { medications: Medication[], clinicalNotes?: string }
 */
export const issuePrescription = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { medications, clinicalNotes } = req.body as {
      medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
      }>;
      clinicalNotes?: string;
    };

    if (!Array.isArray(medications) || medications.length === 0) {
      throw new AppError("At least one medication is required.", 400);
    }

    // Populate full doctor profile so we can include it in the PDF
    const appointment = await Appointment.findById(id)
      .populate<{ patient: IUser }>("patient", "firstName lastName")
      .populate<{
        doctor: IUser;
      }>("doctor", "firstName lastName doctorProfile");

    if (!appointment) {
      throw new AppError("Appointment not found.", 404);
    }

    // ── Generate PDF ──────────────────────────────────────────────────────────
    const pdfBuffer = await generatePrescriptionPdf({
      patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      doctorName: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      doctorSpecialization: appointment.doctor.doctorProfile?.specialization,
      doctorLicense: appointment.doctor.doctorProfile?.licenseNumber,
      doctorExperience: appointment.doctor.doctorProfile?.experienceYears,
      appointmentDate: appointment.appointmentDate,
      medications,
      clinicalNotes,
    });

    // ── Determine PDF URL ─────────────────────────────────────────────────────
    // Try cloud upload first; if credentials are missing fall back to storing
    // the PDF in the DB and serving it via the backend download endpoint.
    let pdfUrl: string;
    let pdfData: string | undefined;

    try {
      const result = await uploadToCloud(pdfBuffer, `prescription-${id}`);
      pdfUrl = result.url;
    } catch {
      // Store base64 in DB and expose a backend download endpoint
      pdfData = pdfBuffer.toString("base64");
      const baseUrl =
        process.env.BACKEND_URL ??
        `http://localhost:${process.env.PORT ?? 5000}`;
      pdfUrl = `${baseUrl}/api/v1/doctor/appointments/${id}/prescription/download`;
    }

    // ── Persist prescription on appointment ───────────────────────────────────
    type MedArray = NonNullable<
      (typeof appointment)["prescription"]
    >["medications"];

    // Set each field explicitly so Mongoose picks them all up correctly
    appointment.prescription = {
      medications: medications as MedArray,
      pdfUrl,
      issuedAt: new Date(),
    } as typeof appointment.prescription;

    // Store the base64 PDF data separately (Mongoose allows extra fields on mixed paths)
    if (pdfData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (appointment.prescription as any).pdfData = pdfData;
    }

    if (clinicalNotes) {
      appointment.clinicalNotes = {
        ...appointment.clinicalNotes,
        doctorDiagnosis: clinicalNotes,
      };
    }

    // Mark appointment as completed when prescription is issued
    appointment.status = "completed";

    await appointment.save();

    // ── Real-time notification to patient ─────────────────────────────────────
    try {
      getIO()
        .to((appointment.patient._id as { toString(): string }).toString())
        .emit("notification:prescription", {
          message: "Your prescription is ready",
          appointmentId: appointment._id,
          pdfUrl,
        });
    } catch {
      // Socket notification is non-critical — do not fail the request
    }

    res.status(200).json({
      success: true,
      data: { pdfUrl, appointment },
    });
  },
);

// ─── Download Prescription PDF ────────────────────────────────────────────────

/**
 * GET /doctor/appointments/:id/prescription/download
 *
 * Streams the stored PDF back to the client as a downloadable file.
 * Works for both doctors (issuer) and patients (recipient).
 */
export const downloadPrescription = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const appointment = await Appointment.findById(id).select(
      "prescription patient doctor",
    );

    if (!appointment) {
      throw new AppError("Appointment not found.", 404);
    }

    const pdfData = (appointment.prescription as { pdfData?: string })?.pdfData;

    if (!pdfData) {
      // If there's a cloud URL, redirect to it
      if (appointment.prescription?.pdfUrl) {
        return res.redirect(appointment.prescription.pdfUrl);
      }
      throw new AppError("Prescription PDF not available.", 404);
    }

    const buffer = Buffer.from(pdfData, "base64");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="prescription-${id}.pdf"`,
      "Content-Length": buffer.length,
    });

    res.send(buffer);
  },
);
