import { http } from "./http";

export type Study = {
    id: string;
    name: string;
    protocolCode: string;
    status: "DRAFT" | "ACTIVE";
    createdAt: string;
    updatedAt: string;
};

export async function listStudies(): Promise<Study[]> {
    const { data } = await http.get("/studies");
    return Array.isArray(data) ? data : [data];
}

export async function createStudy(payload: { name: string; protocolCode: string; status: "DRAFT" | "ACTIVE" }) {
    const { data } = await http.post("/studies", payload);
    return data as Study;
}
export async function getStudies(): Promise<Study[]> {
    const res = await http.get("/studies");
    return res.data;
}

export async function getStudy(id: string) {
    const { data } = await http.get(`/studies/${id}`);
    return data as Study;
}
