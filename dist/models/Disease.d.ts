import { Document, Types } from "mongoose";
export interface IDisease extends Document {
    name: string;
    symptoms: string[];
    description: string;
    precautions: string[];
    suggestedMeds: Types.ObjectId[];
    emergencyLevel: "low" | "medium" | "high" | "critical";
}
declare const Disease: import("mongoose").Model<IDisease, {}, {}, {}, Document<unknown, {}, IDisease, {}, import("mongoose").DefaultSchemaOptions> & IDisease & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDisease>;
export default Disease;
//# sourceMappingURL=Disease.d.ts.map