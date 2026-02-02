import * as React from "react";
import { cn } from "./cn";

type Props = {
    open: boolean;
    title?: string;
    description?: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
};

export function Modal({
    open,
    title,
    description,
    onClose,
    children,
    footer,
    className,
}: Props) {
    React.useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center"
            role="dialog"
            aria-modal="true"
        >
            <button
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
                aria-label="Close modal"
            />
            <div
                className={cn(
                    "relative w-[min(92vw,520px)] rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl " +
                    "dark:border-zinc-800 dark:bg-zinc-950",
                    className
                )}
            >
                {(title || description) && (
                    <div className="mb-4">
                        {title && (
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="mt-1 text-sm text-zinc-500">{description}</p>
                        )}
                    </div>
                )}

                <div className="text-sm text-zinc-800 dark:text-zinc-100">
                    {children}
                </div>

                {footer ? <div className="mt-5 flex justify-end gap-2">{footer}</div> : null}
            </div>
        </div>
    );
}
