"use client";

import { ImageIcon, MessageSquare } from "lucide-react";
import type { Alternate } from "@/lib/types";

interface AlternateCardProps {
  alternate: Alternate;
}

export function AlternateCard({ alternate }: AlternateCardProps) {
  const isText = alternate.type === "text";
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isText ? "bg-blue-500/10 text-blue-500" : "bg-fuchsia-500/10 text-fuchsia-500"
          }`}
        >
          {isText ? <MessageSquare className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
        </span>
        <span className="uppercase tracking-wide text-[var(--muted)]">
          {isText ? "Text" : "Image"} alternate
        </span>
      </div>
      <p className="mt-3 text-sm text-[var(--foreground)]">{alternate.suggestion}</p>
    </article>
  );
}
