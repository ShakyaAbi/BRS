import Image from "next/image";
import type { Evidence } from "@/lib/types";

interface EvidenceGridProps {
  items: Evidence[];
}

export function EvidenceGrid({ items }: EvidenceGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item, index) => (
        <figure
          key={`${item.label}-${index}`}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
        >
          <div className="overflow-hidden rounded-t-2xl">
            <Image
              src={item.thumbnail}
              alt={item.label}
              width={320}
              height={180}
              className="h-36 w-full object-cover"
            />
          </div>
          <figcaption className="px-4 py-3 text-sm text-[var(--muted)]">
            {item.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
