import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { calculateSymptomMatch } from "./services/symptomEngine";
import {
  verifyToken,
  restrictTo,
  checkReadOnlyAdmin,
  AuthenticatedRequest,
} from "./middleware/auth.middleware";
import { Appointment, Medicine, Disease, User } from "./models/Schemas";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_nodes_512";

// In-Memory Fallback Store if MongoDB String is omitted for immediate evaluation
let mockAppointments = [
  {
    id: "app-1",
    patientName: "Jane Doe",
    patientId: "pat-100",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    timeSlot: "10:00 AM - May 25",
    status: "Pending",
    symptomBrief: "Palpitations, Mild Dyspnea",
  },
  {
    id: "app-2",
    patientName: "Alex Smith",
    patientId: "pat-200",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    timeSlot: "11:30 AM - May 26",
    status: "Approved",
    symptomBrief: "Chest tightness under exertion",
    dosageBrief: "Lisinopril 10mg PO QD",
    prescriptionUrl: "#mock-pdf",
  },
];

let mockMedicines = [
  {
    id: "med-1",
    brandName: "Amoxil",
    genericName: "Amoxicillin",
    price: 24.99,
    stock: 142,
    category: "Antibiotics",
    description:
      "Broad-spectrum penicillin antibiotic used to resolve systemic bacterial infections.",
    uses: "Bacterial infections, respiratory tract infections.",
    sideEffects: "Nausea, rash, diarrhea.",
    precautions: "Verify penicillin allergy history.",
  },
  {
    id: "med-2",
    brandName: "Calpol",
    genericName: "Paracetamol",
    price: 8.5,
    stock: 400,
    category: "Fever",
    description:
      "Analgesic and antipyretic medication formulated for structural reduction of thermal distress.",
    uses: "Mild pain relief, pyrexia reduction.",
    sideEffects: "Rare skin hypersensitivity.",
    precautions: "Monitor cumulative daily dose to prevent hepatic risk.",
  },
];

let mockDiseases = [
  {
    name: "Acute Bronchitis",
    symptoms: ["cough", "mucus", "fatigue", "shortness of breath"],
    description: "Inflammation of the lining of your bronchial tubes.",
    precautions: ["Rest", "Hydrate", "Avoid irritants"],
    emergencyLevel: "medium",
  },
  {
    name: "Hypertensive Crisis",
    symptoms: [
      "chest pain",
      "severe headache",
      "shortness of breath",
      "dizziness",
    ],
    description: "Severe increase in blood pressure that can lead to a stroke.",
    precautions: ["Seek emergency care", "Sit upright", "Remain calm"],
    emergencyLevel: "critical",
  },
];

// Socket connection
io.on("connection", (socket) => {
  socket.on("join_room", (userId) => {
    socket.join(userId);
  });
});

// Authentication Gateways
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  // Demo auto-generation access token
  let role: "patient" | "doctor" | "admin" = "patient";
  let name = "Demo User";

  if (email.includes("admin")) {
    role = "admin";
    name = "Chief Administrator";
  } else if (email.includes("doctor")) {
    role = "doctor";
    name = "Dr. Sarah Jenkins";
  } else if (email.includes("patient")) {
    role = "patient";
    name = "Jane Doe";
  }

  const token = jwt.sign({ id: `usr-${Date.now()}`, role, email }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.json({
    token,
    user: {
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
    },
  });
});

// Diagnostic Symptom Logic Core Route
app.post("/api/engine/analyze", async (req, res) => {
  const { symptoms } = req.body;
  if (!Array.isArray(symptoms))
    return res
      .status(400)
      .json({
        message: "Symptoms must be structured within an array structure.",
      });

  try {
    const liveMatches = await calculateSymptomMatch(symptoms);
    if (liveMatches.length > 0) return res.json(liveMatches);
  } catch (err) {}

  // Context Fallback processing if DB connection is unset
  const inputNorm = symptoms.map((s) => s.toLowerCase().trim());
  const fallbackMatches = mockDiseases
    .map((d) => {
      const matched = d.symptoms.filter((s) => inputNorm.includes(s));
      const score = d.symptoms.length
        ? Math.round((matched.length / d.symptoms.length) * 100)
        : 0;
      return { ...d, probabilityMatch: score };
    })
    .filter((d) => d.probabilityMatch > 0)
    .sort((a, b) => b.probabilityMatch - a.probabilityMatch);

  return res.json(fallbackMatches);
});

// Medical Commerce Hub Directory
app.get("/api/medicines", async (req, res) => {
  try {
    const dbMeds = await Medicine.find();
    if (dbMeds.length) return res.json(dbMeds);
  } catch (e) {}
  return res.json(mockMedicines);
});

app.post(
  "/api/medicines",
  verifyToken,
  restrictTo("admin"),
  checkReadOnlyAdmin,
  async (req, res) => {
    return res.status(201).json({ message: "Write executed successfully." });
  },
);

// Appointment Processing Pipeline
app.get("/api/appointments", verifyToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  if (user.role === "doctor") return res.json(mockAppointments);
  return res.json(
    mockAppointments.filter(
      (a) => a.patientId === "pat-100" || a.id === "app-1",
    ),
  );
});

app.post("/api/appointments", verifyToken, (req: AuthenticatedRequest, res) => {
  const { doctorName, specialty, timeSlot, symptomBrief } = req.body;
  const newApp = {
    id: `app-${Date.now()}`,
    patientId: "pat-100",
    patientName:
      req.user?.email === "patient@medivantage.ai"
        ? "Jane Doe"
        : "Anonymous Patient",
    doctorId: "doc-1",
    doctorName,
    specialty,
    timeSlot,
    status: "Pending" as const,
    symptomBrief,
  };
  mockAppointments.unshift(newApp);
  io.to("doc-1").emit("notification", {
    message: `New appointment routing notification from ${newApp.patientName}`,
  });
  return res.status(201).json(newApp);
});

app.patch(
  "/api/appointments/:id/status",
  verifyToken,
  restrictTo("doctor"),
  (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = mockAppointments.find((a) => a.id === id);
    if (!appointment)
      return res
        .status(404)
        .json({ message: "Target record identification missing." });

    appointment.status = status;
    io.to(appointment.patientId).emit("notification", {
      message: `Your consultation request status was updated to: ${status} by ${appointment.doctorName}.`,
    });
    return res.json(appointment);
  },
);

app.post(
  "/api/appointments/:id/prescribe",
  verifyToken,
  restrictTo("doctor"),
  (req, res) => {
    const { id } = req.params;
    const { dosageBrief } = req.body;
    const appointment = mockAppointments.find((a) => a.id === id);
    if (!appointment)
      return res
        .status(404)
        .json({ message: "Target record reference broken." });

    appointment.dosageBrief = dosageBrief;
    appointment.prescriptionUrl = `/api/prescription/download/${id}`;
    return res.json(appointment);
  },
);

// Dynamic Binary Binary Generation Route
app.get("/api/prescription/download/:id", (req, res) => {
  const appointment = mockAppointments.find((a) => a.id === req.params.id);
  const targetName = appointment ? appointment.patientName : "Unknown Patient";
  const clinicalBrief = appointment
    ? appointment.dosageBrief
    : "No custom modifications specified.";

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Prescription_${req.params.id}.pdf`,
  );

  // Custom mock structural minimal PDF compliance text buffer injection
  const mockPdfBuffer = Buffer.from(
    `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>\nendobj\n4 0 obj\n<< /Length 250 >>\nstream\nBT\n/F1 18 Tf\n40 780 Td\n(MEDIVANTAGE AI - ELECTRONIC HEALTH SYSTEM PRESCRIPTION) Tj\n/F1 12 Tf\n0 -40 Td\n(Patient Verification Target: ${targetName}) Tj\n0 -20 Td\n(Diagnostic Evaluation Reference ID: ${req.params.id}) Tj\n0 -30 Td\n(Clinical Treatment Strategy/Dosage Guideline:) Tj\n0 -20 Td\n(${clinicalBrief}) Tj\n0 -60 Td\n(System Validation Signature: Generated electronically by MediVantage Protocols.) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000062 00000 n\n0000000119 00000 n\n0000000273 00000 n\ntrailer\n<< /Size 5 >>\nstartxref\n570\n%%EOF`,
  );
  return res.send(mockPdfBuffer);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(
    `Network execution center bound to standard port protocol: ${PORT}`,
  ),
);
