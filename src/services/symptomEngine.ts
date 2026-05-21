import { Disease, IDisease } from "../models/Schemas";

export interface EngineResult {
  diseaseId: string;
  name: string;
  probabilityMatch: number;
  description: string;
  precautions: string[];
  emergencyLevel: "low" | "medium" | "high" | "critical";
}

export const calculateSymptomMatch = async (
  inputSymptoms: string[],
): Promise<EngineResult[]> => {
  const normalizedInput = inputSymptoms.map((s) => s.toLowerCase().trim());
  if (normalizedInput.length === 0) return [];

  const allDiseases = (await Disease.find().lean()) as unknown as IDisease[];
  const results: EngineResult[] = [];

  for (const disease of allDiseases) {
    const diseaseSymptoms = disease.symptoms.map((s) => s.toLowerCase().trim());
    const matched = diseaseSymptoms.filter((s) => normalizedInput.includes(s));

    if (matched.length > 0) {
      const matchPercentage = Math.round(
        (matched.length / diseaseSymptoms.length) * 100,
      );
      results.push({
        diseaseId: (disease as any)._id.toString(),
        name: disease.name,
        probabilityMatch: matchPercentage,
        description: disease.description,
        precautions: disease.precautions,
        emergencyLevel: disease.emergencyLevel,
      });
    }
  }

  return results.sort((a, b) => b.probabilityMatch - a.probabilityMatch);
};
