import { IMedicine } from "../models/Medicine";
export interface EngineResult {
    diseaseId: string;
    name: string;
    probabilityMatch: number;
    description: string;
    precautions: string[];
    emergencyLevel: "low" | "medium" | "high" | "critical";
    suggestedMedicines: IMedicine[];
}
export declare const calculateSymptomMatch: (inputSymptoms: string[]) => Promise<EngineResult[]>;
//# sourceMappingURL=symptomEngine.d.ts.map