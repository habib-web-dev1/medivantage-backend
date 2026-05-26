import { jsPDF } from "jspdf";

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
 * Generates a PDF prescription using jsPDF (pure JS — works on Vercel serverless).
 */
export async function generatePrescriptionPdf(
  data: PrescriptionData,
): Promise<Buffer> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const hex = (h: string) => {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    return [r, g, b] as [number, number, number];
  };

  const setColor = (color: string) => doc.setTextColor(...hex(color));
  const setFill = (color: string) => doc.setFillColor(...hex(color));
  const setDraw = (color: string) => doc.setDrawColor(...hex(color));

  // ── Header ─────────────────────────────────────────────────────────────────
  setFill("#3b82f6");
  doc.rect(0, 0, pageW, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("MediVantage", margin, 13);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("AI-Driven Diagnostics, Human-Centered Care", margin, 19);

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255, 0.3);
  doc.text("Rx", pageW - margin - 2, 17, { align: "right" });

  y = 30;

  // ── Doctor card ────────────────────────────────────────────────────────────
  setFill("#f8fafc");
  setDraw("#3b82f6");
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentW, 28, 2, 2, "FD");

  // Blue left accent bar
  setFill("#3b82f6");
  doc.rect(margin, y, 3, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setColor("#1e293b");
  doc.text(data.doctorName, margin + 7, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setColor("#64748b");

  let metaX = margin + 7;
  const metaY = y + 15;

  if (data.doctorSpecialization) {
    doc.text(`Specialization: ${data.doctorSpecialization}`, metaX, metaY);
    metaX += 70;
  }
  if (data.doctorLicense) {
    doc.text(`License: ${data.doctorLicense}`, metaX, metaY);
    metaX += 55;
  }
  if (data.doctorExperience) {
    doc.text(`Experience: ${data.doctorExperience} years`, metaX, metaY);
  }

  y += 36;

  // ── Section label helper ───────────────────────────────────────────────────
  const sectionLabel = (label: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setColor("#3b82f6");
    doc.text(label.toUpperCase(), margin, y);
    setDraw("#e2e8f0");
    doc.setLineWidth(0.3);
    doc.line(
      margin + doc.getTextWidth(label.toUpperCase()) + 2,
      y - 0.5,
      margin + contentW,
      y - 0.5,
    );
    y += 6;
  };

  // ── Prescription details ───────────────────────────────────────────────────
  sectionLabel("Prescription Details");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setColor("#475569");
  doc.text("Patient Name:", margin, y);
  doc.setFont("helvetica", "bold");
  setColor("#1e293b");
  doc.text(data.patientName, margin + 28, y);

  doc.setFont("helvetica", "normal");
  setColor("#475569");
  doc.text("Date Issued:", margin + 100, y);
  doc.setFont("helvetica", "bold");
  setColor("#1e293b");
  doc.text(data.appointmentDate.toLocaleDateString(), margin + 125, y);

  y += 10;

  // ── Medications table ──────────────────────────────────────────────────────
  sectionLabel("Prescribed Medications");

  // Table header
  const cols = [60, 35, 45, 34]; // widths
  const headers = ["Medicine", "Dosage", "Frequency", "Duration"];

  setFill("#3b82f6");
  doc.rect(margin, y, contentW, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);

  let colX = margin + 3;
  headers.forEach((h, i) => {
    doc.text(h, colX, y + 5.5);
    colX += cols[i]!;
  });
  y += 8;

  // Table rows
  data.medications.forEach((med, idx) => {
    const rowH = 8;
    if (idx % 2 === 0) {
      setFill("#f8fafc");
      doc.rect(margin, y, contentW, rowH, "F");
    }

    setDraw("#e2e8f0");
    doc.setLineWidth(0.2);
    doc.line(margin, y + rowH, margin + contentW, y + rowH);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setColor("#334155");

    colX = margin + 3;
    [med.name, med.dosage, med.frequency, med.duration].forEach((val, i) => {
      doc.text(val, colX, y + 5.5);
      colX += cols[i]!;
    });
    y += rowH;
  });

  y += 8;

  // ── Clinical notes ─────────────────────────────────────────────────────────
  if (data.clinicalNotes) {
    sectionLabel("Clinical Notes");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor("#475569");
    const lines = doc.splitTextToSize(data.clinicalNotes, contentW);
    doc.text(lines as string[], margin, y);
    y += (lines as string[]).length * 5 + 6;
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  const footerY = 275;
  setDraw("#e2e8f0");
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, margin + contentW, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setColor("#94a3b8");
  doc.text(
    "This prescription was generated electronically by MediVantage.",
    margin,
    footerY + 5,
  );
  doc.text(
    "Always consult your healthcare provider before making any changes to your medication.",
    margin,
    footerY + 9,
  );

  // Signature
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setColor("#475569");
  const sigX = margin + contentW;
  doc.line(sigX - 45, footerY + 12, sigX, footerY + 12);
  doc.text(data.doctorName, sigX, footerY + 17, { align: "right" });

  // Return as Buffer
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
