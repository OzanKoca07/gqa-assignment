import axios from "axios";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
    withCredentials: true,
});

export function apiErrorMessage(err: any): string {
    const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Unexpected error";
    return Array.isArray(msg) ? msg.join(", ") : String(msg);
}
