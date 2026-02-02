
import { cn } from "./cn";
import React from "react";

export type Column<T> = {
    header: string;
    key: keyof T | string;
    render?: (row: T) => React.ReactNode;
    className?: string;
};

type TableProps<T> = {
    columns: Column<T>[];
    rows: T[];
    className?: string;
};

export function Table<T extends Record<string, any>>({
    columns,
    rows,
    className,
}: TableProps<T>) {
    return (
        <div className={cn("w-full overflow-x-auto rounded-xl border border-neutral-800", className)}>
            <table className="w-full text-sm">
                <thead className="bg-neutral-900 text-neutral-400 uppercase text-xs tracking-wide">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={cn(
                                    "px-4 py-3 text-left font-medium",
                                    col.className
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-neutral-800">
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="hover:bg-neutral-900/60 transition-colors"
                        >
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="px-4 py-3 text-neutral-200">
                                    {col.render
                                        ? col.render(row)
                                        : (row as any)[col.key as keyof T]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
