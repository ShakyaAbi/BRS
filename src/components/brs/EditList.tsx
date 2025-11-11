import type { Edit } from "@/lib/types";

interface EditListProps {
  edits: Edit[];
}

const severityMap: Record<Edit["severity"], string> = {
  low: "text-emerald-500",
  medium: "text-amber-500",
  high: "text-rose-500",
};

export function EditList({ edits }: EditListProps) {
  return (
    <ol className="space-y-3">
      {edits.map((edit, index) => (
        <li
          key={`${edit.message}-${index}`}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
        >
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Edit {index + 1}
          </p>
          <p className="text-sm font-medium text-[var(--foreground)]">
            {edit.message}
          </p>
          <p className={`text-xs font-semibold ${severityMap[edit.severity]}`}>
            {edit.severity} priority
          </p>
        </li>
      ))}
    </ol>
  );
}
