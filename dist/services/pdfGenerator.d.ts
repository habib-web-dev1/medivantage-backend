export interface PrescriptionData {
    patientName: string;
    doctorName: string;
    doctorSpecialization?: string;
    doctorLicense?: string;
    doctorExperience?: number;
    appointmentDate: Date;
    medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
    }>;
    clinicalNotes?: string;
}
/**
 * Generates a PDF prescription from the provided data.
 * Reads the HTML template, performs token substitution, and renders via
 * html-pdf-node (Puppeteer under the hood).
 */
export declare function generatePrescriptionPdf(data: PrescriptionData): Promise<Buffer>;
//# sourceMappingURL=pdfGenerator.d.ts.map