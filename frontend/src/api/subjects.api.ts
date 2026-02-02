import { http } from "./http";

export type Subject = {
    id: string;
    studyId: string;
    subjectCode: string;
    enrollmentDate: string;
    createdAt: string;
    updatedAt: string;
};

export type ScheduledVisit = {
    id: string;
    subjectId: string;
    visitTemplateId: string;
    scheduledDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;

    // backend include ediyorsa gelebilir
    visitTemplate?: {
        id: string;
        name: string;
        code: string;
        day: number;
        windowBefore: number;
        windowAfter: number;
    };
};

export async function createSubject(
    studyId: string,
    payload: { subjectCode: string; enrollmentDate: string }
) {
    const { data } = await http.post(`/studies/${studyId}/subjects`, payload);
    return data as Subject;
}

export async function listSubjects(studyId: string): Promise<Subject[]> {
    const { data } = await http.get(`/studies/${studyId}/subjects`);
    return Array.isArray(data) ? (data as Subject[]) : ([data] as Subject[]);
}

// ✅ EKLE: subject detail endpoint
export async function getSubject(studyId: string, subjectId: string): Promise<Subject> {
    const { data } = await http.get(`/studies/${studyId}/subjects/${subjectId}`);
    return data as Subject;
}

// ✅ generate endpoint tek obje döndürebilir; normalize et
export async function generateScheduledVisits(
    studyId: string,
    subjectId: string
): Promise<ScheduledVisit[]> {
    const { data } = await http.post(
        `/studies/${studyId}/subjects/${subjectId}/scheduled-visits/generate`
    );
    return Array.isArray(data) ? (data as ScheduledVisit[]) : ([data] as ScheduledVisit[]);
}
export async function getScheduledVisit(studyId: string, subjectId: string, scheduledVisitId: string) {
    const { data } = await http.get(
        `/studies/${studyId}/subjects/${subjectId}/scheduled-visits/${scheduledVisitId}`
    );
    return data as ScheduledVisit;
}


export async function listScheduledVisits(
    studyId: string,
    subjectId: string
): Promise<ScheduledVisit[]> {
    const { data } = await http.get(
        `/studies/${studyId}/subjects/${subjectId}/scheduled-visits`
    );
    return Array.isArray(data) ? (data as ScheduledVisit[]) : ([data] as ScheduledVisit[]);
}

