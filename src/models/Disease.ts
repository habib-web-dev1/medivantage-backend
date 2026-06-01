import { Schema, model, Document, Types } from "mongoose";

export interface IDisease extends Document {
  name: string;
  symptoms: string[];
  description: string;
  precautions: string[];
  suggestedMeds: Types.ObjectId[];
  emergencyLevel: "low" | "medium" | "high" | "critical";
}

const DiseaseSchema = new Schema<IDisease>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    symptoms: [{ type: String, lowercase: true, trim: true }],
    description: { type: String, required: true },
    precautions: [{ type: String }],
    suggestedMeds: [{ type: Schema.Types.ObjectId, ref: "Medicine" }],
    emergencyLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
  },
  { timestamps: true },
);

const Disease = model<IDisease>("Disease", DiseaseSchema);

export default Disease;
