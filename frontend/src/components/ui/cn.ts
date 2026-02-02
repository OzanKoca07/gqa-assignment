import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind + conditional class utility
 * Example: cn("p-2", isActive && "bg-red-500")
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
