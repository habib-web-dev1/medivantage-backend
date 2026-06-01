import { Schema, model, Document } from "mongoose";

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

const MedicineSchema = new Schema<IMedicine>(
  {
    brandName: { type: String, required: true, trim: true },
    genericName: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    uses: { type: String, required: true },
    sideEffects: { type: String, required: true },
    precautions: { type: String, required: true },
  },
  { timestamps: true },
);

const Medicine = model<IMedicine>("Medicine", MedicineSchema);

export default Medicine;
