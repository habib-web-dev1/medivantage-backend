import { Document, Model } from "mongoose";
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "patient" | "doctor" | "admin";
    phoneNumber?: string;
    patientProfile?: {
        dateOfBirth?: Date;
        gender?: "Male" | "Female" | "Other" | "Prefer not to say";
        bloodType?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        allergies?: string[];
        chronicConditions?: string[];
    };
    doctorProfile?: {
        specialization?: string;
        licenseNumber?: string;
        experienceYears?: number;
        isVerified?: boolean;
        bio?: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}
interface IUserModel extends Model<IUser> {
}
declare const User: IUserModel;
export default User;
//# sourceMappingURL=User.d.ts.map