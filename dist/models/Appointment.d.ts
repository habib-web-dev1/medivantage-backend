import mongoose from "mongoose";
declare const Appointment: mongoose.Model<{
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    appointmentDate: NativeDate;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    aiDiagnostics?: {
        reportedSymptoms: string[];
        severityAssessment: "Low" | "Moderate" | "High" | "Critical";
        aiSuggestedPreliminaryDiagnosis?: string | null | undefined;
        aiConfidenceScore?: number | null | undefined;
    } | null | undefined;
    clinicalNotes?: {
        symptomsObserved?: string | null | undefined;
        doctorDiagnosis?: string | null | undefined;
    } | null | undefined;
    prescription?: {
        medications: mongoose.Types.DocumentArray<{
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, {}, {}> & {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        pdfUrl?: string | null | undefined;
        pdfData?: string | null | undefined;
        issuedAt?: NativeDate | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    appointmentDate: NativeDate;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    aiDiagnostics?: {
        reportedSymptoms: string[];
        severityAssessment: "Low" | "Moderate" | "High" | "Critical";
        aiSuggestedPreliminaryDiagnosis?: string | null | undefined;
        aiConfidenceScore?: number | null | undefined;
    } | null | undefined;
    clinicalNotes?: {
        symptomsObserved?: string | null | undefined;
        doctorDiagnosis?: string | null | undefined;
    } | null | undefined;
    prescription?: {
        medications: mongoose.Types.DocumentArray<{
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, {}, {}> & {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        pdfUrl?: string | null | undefined;
        pdfData?: string | null | undefined;
        issuedAt?: NativeDate | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    appointmentDate: NativeDate;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    aiDiagnostics?: {
        reportedSymptoms: string[];
        severityAssessment: "Low" | "Moderate" | "High" | "Critical";
        aiSuggestedPreliminaryDiagnosis?: string | null | undefined;
        aiConfidenceScore?: number | null | undefined;
    } | null | undefined;
    clinicalNotes?: {
        symptomsObserved?: string | null | undefined;
        doctorDiagnosis?: string | null | undefined;
    } | null | undefined;
    prescription?: {
        medications: mongoose.Types.DocumentArray<{
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, {}, {}> & {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        pdfUrl?: string | null | undefined;
        pdfData?: string | null | undefined;
        issuedAt?: NativeDate | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    appointmentDate: NativeDate;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    aiDiagnostics?: {
        reportedSymptoms: string[];
        severityAssessment: "Low" | "Moderate" | "High" | "Critical";
        aiSuggestedPreliminaryDiagnosis?: string | null | undefined;
        aiConfidenceScore?: number | null | undefined;
    } | null | undefined;
    clinicalNotes?: {
        symptomsObserved?: string | null | undefined;
        doctorDiagnosis?: string | null | undefined;
    } | null | undefined;
    prescription?: {
        medications: mongoose.Types.DocumentArray<{
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, {}, {}> & {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        pdfUrl?: string | null | undefined;
        pdfData?: string | null | undefined;
        issuedAt?: NativeDate | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    appointmentDate: NativeDate;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    aiDiagnostics?: {
        reportedSymptoms: string[];
        severityAssessment: "Low" | "Moderate" | "High" | "Critical";
        aiSuggestedPreliminaryDiagnosis?: string | null | undefined;
        aiConfidenceScore?: number | null | undefined;
    } | null | undefined;
    clinicalNotes?: {
        symptomsObserved?: string | null | undefined;
        doctorDiagnosis?: string | null | undefined;
    } | null | undefined;
    prescription?: {
        medications: mongoose.Types.DocumentArray<{
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, {}, {}> & {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        pdfUrl?: string | null | undefined;
        pdfData?: string | null | undefined;
        issuedAt?: NativeDate | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    appointmentDate: NativeDate;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    aiDiagnostics?: {
        reportedSymptoms: string[];
        severityAssessment: "Low" | "Moderate" | "High" | "Critical";
        aiSuggestedPreliminaryDiagnosis?: string | null | undefined;
        aiConfidenceScore?: number | null | undefined;
    } | null | undefined;
    clinicalNotes?: {
        symptomsObserved?: string | null | undefined;
        doctorDiagnosis?: string | null | undefined;
    } | null | undefined;
    prescription?: {
        medications: mongoose.Types.DocumentArray<{
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, {}, {}> & {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        pdfUrl?: string | null | undefined;
        pdfData?: string | null | undefined;
        issuedAt?: NativeDate | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    appointmentDate: NativeDate;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    aiDiagnostics?: {
        reportedSymptoms: string[];
        severityAssessment: "Low" | "Moderate" | "High" | "Critical";
        aiSuggestedPreliminaryDiagnosis?: string | null | undefined;
        aiConfidenceScore?: number | null | undefined;
    } | null | undefined;
    clinicalNotes?: {
        symptomsObserved?: string | null | undefined;
        doctorDiagnosis?: string | null | undefined;
    } | null | undefined;
    prescription?: {
        medications: mongoose.Types.DocumentArray<{
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, {}, {}> & {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        pdfUrl?: string | null | undefined;
        pdfData?: string | null | undefined;
        issuedAt?: NativeDate | null | undefined;
    } | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    appointmentDate: NativeDate;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    aiDiagnostics?: {
        reportedSymptoms: string[];
        severityAssessment: "Low" | "Moderate" | "High" | "Critical";
        aiSuggestedPreliminaryDiagnosis?: string | null | undefined;
        aiConfidenceScore?: number | null | undefined;
    } | null | undefined;
    clinicalNotes?: {
        symptomsObserved?: string | null | undefined;
        doctorDiagnosis?: string | null | undefined;
    } | null | undefined;
    prescription?: {
        medications: mongoose.Types.DocumentArray<{
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }, {}, {}> & {
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        pdfUrl?: string | null | undefined;
        pdfData?: string | null | undefined;
        issuedAt?: NativeDate | null | undefined;
    } | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Appointment;
//# sourceMappingURL=Appointment.d.ts.map