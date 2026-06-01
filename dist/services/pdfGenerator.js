"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePrescriptionPdf = generatePrescriptionPdf;
const html_pdf_node_1 = __importDefault(require("html-pdf-node"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Generates a PDF prescription from the provided data.
 * Reads the HTML template, performs token substitution, and renders via
 * html-pdf-node (Puppeteer under the hood).
 */
async function generatePrescriptionPdf(data) {
    const templatePath = path_1.default.join(__dirname, "../templates/prescription.html");
    let html = fs_1.default.readFileSync(templatePath, "utf-8");
    // Build medication table rows
    const medicationsRows = data.medications
        .map((m) => `<tr><td>${m.name}</td><td>${m.dosage}</td><td>${m.frequency}</td><td>${m.duration}</td></tr>`)
        .join("");
    // Build doctor info rows
    const specializationRow = data.doctorSpecialization
        ? `<div class="doctor-meta-item"><label>Specialization</label><span>${data.doctorSpecialization}</span></div>`
        : "";
    const licenseRow = data.doctorLicense
        ? `<div class="doctor-meta-item"><label>License No.</label><span>${data.doctorLicense}</span></div>`
        : "";
    const experienceRow = data.doctorExperience
        ? `<div class="doctor-meta-item"><label>Experience</label><span>${data.doctorExperience} years</span></div>`
        : "";
    // Build optional clinical notes section
    const clinicalNotesSection = data.clinicalNotes
        ? `<div class="section"><div class="section-title">Clinical Notes</div><p style="font-size:13px; color:#475569;">${data.clinicalNotes}</p></div>`
        : "";
    html = html
        // Use split/join instead of replaceAll for broader TS target compatibility
        .split("__PATIENT_NAME__")
        .join(data.patientName)
        .split("__DOCTOR_NAME__")
        .join(data.doctorName)
        .replace("__DOCTOR_SPECIALIZATION_ROW__", specializationRow)
        .replace("__DOCTOR_LICENSE_ROW__", licenseRow)
        .replace("__DOCTOR_EXPERIENCE_ROW__", experienceRow)
        .replace("__DATE__", data.appointmentDate.toLocaleDateString())
        .replace("__MEDICATIONS_ROWS__", medicationsRows)
        .replace("__CLINICAL_NOTES_SECTION__", clinicalNotesSection);
    const file = { content: html };
    const options = { format: "A4" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await html_pdf_node_1.default.generatePdf(file, options);
    return pdfBuffer;
}
//# sourceMappingURL=pdfGenerator.js.map