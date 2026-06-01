import { Document, Types } from "mongoose";
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
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export declare const Disease: import("mongoose").Model<IDisease, {}, {}, {}, Document<unknown, {}, IDisease, {}, import("mongoose").DefaultSchemaOptions> & IDisease & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDisease>;
export declare const Medicine: import("mongoose").Model<IMedicine, {}, {}, {}, Document<unknown, {}, IMedicine, {}, import("mongoose").DefaultSchemaOptions> & IMedicine & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMedicine>;
export declare const Appointment: import("mongoose").Model<IAppointment, {}, {}, {}, Document<unknown, {}, IAppointment, {}, import("mongoose").DefaultSchemaOptions> & IAppointment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAppointment>;
//# sourceMappingURL=Schemas.d.ts.map