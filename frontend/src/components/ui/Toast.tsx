import * as React from "react";
import { cn } from "./cn";

type ToastVariant = "success" | "error" | "info";

export type ToastItem = {
    id: string;
    title?: string;
    message: string;
    variant: ToastVariant;
    durationMs?: number;
};

type ToastContextValue = {
    push: (t: Omit<ToastItem, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = React.useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}

function toastStyles(variant: ToastVariant) {
    switch (variant) {
        case "success":
            return "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-100";
        case "error":
            return "border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-100";
        default:
            return "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-100";
    }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = React.useState<ToastItem[]>([]);

    const push = React.useCallback((t: Omit<ToastItem, "id">) => {
        const id = crypto.randomUUID?.() ?? String(Date.now());
        const item: ToastItem = { id, durationMs: 3000, ...t };
        setItems((prev) => [...prev, item]);

        window.setTimeout(() => {
            setItems((prev) => prev.filter((x) => x.id !== id));
        }, item.durationMs);
    }, []);

    return (
        <ToastContext.Provider value={{ push }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[60] grid gap-2">
                {items.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            "w-[min(92vw,380px)] rounded-2xl border p-3 shadow-lg",
                            toastStyles(t.variant)
                        )}
                    >
                        {t.title ? (
                            <div className="text-sm font-semibold">{t.title}</div>
                        ) : null}
                        <div className="text-sm opacity-90">{t.message}</div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
