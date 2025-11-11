import type { ReactNode } from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  caption?: string;
}

export function DataTable<T>({ columns, rows, caption }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(2,6,23,0.35)] backdrop-blur">
      <table className="w-full border-collapse text-sm text-[var(--foreground)]">
        {caption && (
          <caption className="sr-only">{caption}</caption>
        )}
        <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-[var(--muted)]">
          <tr>
            {columns.map((column) => (
              <th key={column.label} className="px-4 py-3 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-white/5 text-[var(--foreground)] odd:bg-white/0 even:bg-white/[0.02]"
            >
              {columns.map((column) => (
                <td key={column.label} className="px-4 py-3">
                  {column.render
                    ? column.render(row)
                    : String((row as Record<string, unknown>)[column.key as string] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
