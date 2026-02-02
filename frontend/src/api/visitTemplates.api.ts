import { http } from "./http";
import type { FormTemplate } from "./formTemplates.api";

export type VisitTemplate = {
    id: string;
    studyId: string;
    name: string;
    code: string;
    day: number;
    windowBefore: number;
    windowAfter: number;
    createdAt: string;
    updatedAt: string;
};

export async function listVisitTemplates(studyId: string): Promise<VisitTemplate[]> {
    const { data } = await http.get(`/studies/${studyId}/visit-templates`);
    return Array.isArray(data) ? data : [data];
}

export async function getVisitTemplate(studyId: string, visitTemplateId: string): Promise<VisitTemplate> {
    const { data } = await http.get(`/studies/${studyId}/visit-templates/${visitTemplateId}`);
    return data as VisitTemplate;
}

export async function createVisitTemplate(
    studyId: string,
    payload: Pick<VisitTemplate, "name" | "code" | "day" | "windowBefore" | "windowAfter">
): Promise<VisitTemplate> {
    const { data } = await http.post(`/studies/${studyId}/visit-templates`, payload);
    return data as VisitTemplate;
}

export async function updateVisitTemplate(
    studyId: string,
    visitTemplateId: string,
    payload: Partial<Pick<VisitTemplate, "name" | "code" | "day" | "windowBefore" | "windowAfter">>
): Promise<VisitTemplate> {
    const { data } = await http.patch(`/studies/${studyId}/visit-templates/${visitTemplateId}`, payload);
    return data as VisitTemplate;
}

export async function deleteVisitTemplate(studyId: string, visitTemplateId: string): Promise<VisitTemplate> {
    const { data } = await http.delete(`/studies/${studyId}/visit-templates/${visitTemplateId}`);
    return data as VisitTemplate;
}

export async function listAttachedForms(studyId: string, visitTemplateId: string) {
    const { data } = await http.get(`/studies/${studyId}/visit-templates/${visitTemplateId}/forms`);
    return (Array.isArray(data) ? data : [data]) as FormTemplate[];
}

export async function attachFormToVisit(studyId: string, visitTemplateId: string, formTemplateId: string) {
    const { data } = await http.post(`/studies/${studyId}/visit-templates/${visitTemplateId}/forms`, {
        formTemplateId,
    });
    return data;
}

export async function detachFormFromVisit(studyId: string, visitTemplateId: string, formTemplateId: string) {
    const { data } = await http.delete(
        `/studies/${studyId}/visit-templates/${visitTemplateId}/forms/${formTemplateId}`
    );
    return data;
}
