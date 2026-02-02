import { cn } from "./cn";

export function Badge({ variant = "default", className, ...props }:
    React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" }) {

    const v =
        variant === "success" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" :
            variant === "warning" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" :
                "bg-neutral-500/15 text-neutral-200 border-neutral-500/30";

    return (
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs", v, className)} {...props} />
    );
}
