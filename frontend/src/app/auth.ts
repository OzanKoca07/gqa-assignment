const KEY = "gqa_auth";

export type AuthUser = { email: string; name: string };

export function getUser(): AuthUser | null {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
        return null;
    }
}

export function login(email: string, name = "Öğrenci"): void {
    localStorage.setItem(KEY, JSON.stringify({ email, name }));
}

export function logout(): void {
    localStorage.removeItem(KEY);
}

export function isAuthed(): boolean {
    return !!getUser();
}
