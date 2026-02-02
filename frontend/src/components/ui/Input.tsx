import * as React from "react";
import { cn } from "./cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    hint?: string;
    error?: string;
};

export function Input({ className, label, hint, error, id, ...props }: Props) {
    const inputId = id ?? React.useId();
    return (
        <div className="grid gap-1.5">
            {label ? (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                    {label}
                </label>
            ) : null}

            <input
                id={inputId}
                className={cn(
                    "h-10 w-full rounded-xl border bg-white px-3 text-sm text-zinc-900 shadow-sm " +
                    "placeholder:text-zinc-400 outline-none transition " +
                    "focus:ring-2 focus:ring-blue-500/60 " +
                    "dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800",
                    error
                        ? "border-red-500 focus:ring-red-500/40"
                        : "border-zinc-200 focus:border-blue-500/60",
                    className
                )}
                {...props}
            />

            {error ? (
                <p className="text-xs text-red-600">{error}</p>
            ) : hint ? (
                <p className="text-xs text-zinc-500">{hint}</p>
            ) : null}
        </div>
    );
}
