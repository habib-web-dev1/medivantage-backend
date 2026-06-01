import { Document } from "mongoose";
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
declare const Medicine: import("mongoose").Model<IMedicine, {}, {}, {}, Document<unknown, {}, IMedicine, {}, import("mongoose").DefaultSchemaOptions> & IMedicine & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMedicine>;
export default Medicine;
//# sourceMappingURL=Medicine.d.ts.map