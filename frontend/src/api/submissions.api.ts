import { http } from "./http";

export type SubmissionValue = {
    formFieldId: string;
    valueText?: string | null;
    valueNumber?: number | null;
    valueDate?: string | null; // ISO string önerilir
};

export type Submission = {
    id: string;
    scheduledVisitId: string;
    formTemplateId: string;
    submittedAt: string;
    values: any[];
};

export async function createSubmission(
    studyId: string,
    subjectId: string,
    scheduledVisitId: string,
    formTemplateId: string,
    payload: { values: SubmissionValue[] }
) {
    try {
        const { data } = await http.post(
            `/studies/${studyId}/subjects/${subjectId}/scheduled-visits/${scheduledVisitId}/forms/${formTemplateId}/submissions`,
            payload
        );
        return data as Submission;
    } catch (err: any) {
        // NestJS genelde message alanı döndürüyor: { message: "...", error: "...", statusCode: 400 }
        const msg =
            err?.response?.data?.message ??
            err?.response?.data?.error ??
            err?.message ??
            "Request failed";
        throw new Error(Array.isArray(msg) ? msg.join(", ") : String(msg));
    }
}

export async function listSubmissions(studyId: string, subjectId: string, scheduledVisitId: string) {
    const { data } = await http.get(
        `/studies/${studyId}/subjects/${subjectId}/scheduled-visits/${scheduledVisitId}/submissions`
    );
    return Array.isArray(data) ? (data as Submission[]) : ([data] as Submission[]);
}
