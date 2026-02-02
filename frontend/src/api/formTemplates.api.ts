import { http } from "./http";

export type FieldType = "TEXT" | "NUMBER" | "DATE";

export type FormTemplate = {
    id: string;
    studyId: string;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
};

export type FormField = {
    id: string;
    formTemplateId: string;
    label: string;
    key: string;
    type: FieldType;
    required: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
};

export type FormTemplateWithFields = FormTemplate & {
    fields: FormField[];
};

export async function listFormTemplates(studyId: string): Promise<FormTemplate[]> {
    const { data } = await http.get(`/studies/${studyId}/form-templates`);
    return Array.isArray(data) ? data : [data];
}

export async function getFormTemplate(studyId: string, formTemplateId: string): Promise<FormTemplateWithFields> {
    const { data } = await http.get(`/studies/${studyId}/form-templates/${formTemplateId}`);
    return data as FormTemplateWithFields;
}

export async function createFormTemplate(
    studyId: string,
    payload: Pick<FormTemplate, "name" | "code">
): Promise<FormTemplate> {
    const { data } = await http.post(`/studies/${studyId}/form-templates`, payload);
    return data as FormTemplate;
}

export async function createFormField(
    studyId: string,
    formTemplateId: string,
    payload: Pick<FormField, "label" | "key" | "type" | "required" | "order">
): Promise<FormField> {
    const { data } = await http.post(`/studies/${studyId}/form-templates/${formTemplateId}/fields`, payload);
    return data as FormField;
}
