import { http } from "./http";

export type VisitTemplateForm = {
    id?: string;
    visitTemplateId?: string;
    formTemplateId: string;
    // backend ne döndürüyorsa (bazıları formTemplate objesi gömebilir)
    formTemplate?: { id: string; name: string; code: string };
};

export async function listVisitTemplateForms(studyId: string, visitTemplateId: string) {
    const { data } = await http.get(`/studies/${studyId}/visit-templates/${visitTemplateId}/forms`);

    const arr = Array.isArray(data) ? data : [data];

    // normalize: her elemanda formTemplate varsa onu kullan, yoksa elemanın kendisi formTemplate olabilir
    return arr.map((x: any) => {
        if (x?.formTemplate) return x as VisitTemplateForm;
        // x bir formTemplate ise:
        if (x?.id && x?.code) {
            return { formTemplateId: x.id, formTemplate: x } as VisitTemplateForm;
        }
        return x as VisitTemplateForm;
    });
}


// Attachment (sonraki adım için – istersen hemen de kullanırız)
export async function attachFormToVisitTemplate(studyId: string, visitTemplateId: string, formTemplateId: string) {
    const { data } = await http.post(`/studies/${studyId}/visit-templates/${visitTemplateId}/forms`, {
        formTemplateId,
    });
    return data as VisitTemplateForm;
}

export async function detachFormFromVisitTemplate(studyId: string, visitTemplateId: string, formTemplateId: string) {
    const { data } = await http.delete(
        `/studies/${studyId}/visit-templates/${visitTemplateId}/forms/${formTemplateId}`
    );
    return data;
}
