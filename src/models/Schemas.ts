import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "patient" | "doctor" | "admin";
  avatar: string;
}

export interface IDisease extends Document {
  name: string;
  symptoms: string[];
  description: string;
  precautions: string[];
  suggestedMeds: Types.ObjectId[];
  emergencyLevel: "low" | "medium" | "high" | "critical";
}

export interface IMedicine extends Document {
  brandName: string;
  genericName: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  uses: string;
  sideEffects: string;
  precautions: string;
}

export interface IAppointment extends Document {
  patientId: Types.ObjectId | string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  timeSlot: string;
  status: "Pending" | "Approved" | "Declined";
  symptomBrief: string;
  prescriptionUrl?: string;
  dosageBrief?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor", "admin"], required: true },
  avatar: { type: String, required: true },
});

const DiseaseSchema = new Schema<IDisease>({
  name: { type: String, required: true },
  symptoms: [{ type: String, lowercase: true, trim: true }],
  description: { type: String, required: true },
  precautions: [{ type: String }],
  suggestedMeds: [{ type: Schema.Types.ObjectId, ref: "Medicine" }],
  emergencyLevel: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    required: true,
  },
});

const MedicineSchema = new Schema<IMedicine>({
  brandName: { type: String, required: true },
  genericName: { type: String, required: true },
  price: { type: number, required: true },
  stock: { type: number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  uses: { type: String, required: true },
  sideEffects: { type: String, required: true },
  precautions: { type: String, required: true },
});

const AppointmentSchema = new Schema<IAppointment>({
  patientId: { type: Schema.Types.Mixed, required: true },
  patientName: { type: String, required: true },
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  specialty: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Declined"],
    default: "Pending",
  },
  symptomBrief: { type: String, required: true },
  prescriptionUrl: { type: String },
  dosageBrief: { type: String },
});

export const User = model<IUser>("User", UserSchema);
export const Disease = model<IDisease>("Disease", DiseaseSchema);
export const Medicine = model<IMedicine>("Medicine", MedicineSchema);
export const Appointment = model<IAppointment>(
  "Appointment",
  AppointmentSchema,
);
