"use client";

import { useState } from "react";
import type { AuditEntry } from "@/lib/types";
import Link from "next/link";

interface Props {
  entries: AuditEntry[];
}

export function AuditsPanel({ entries }: Props) {
  const [selectedId, setSelectedId] = useState(entries[0]?.id);
  const selected = entries.find((entry) => entry.id === selectedId);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="overflow-hidden rounded-3xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--background)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Audit</th>
              <th className="px-4 py-3">Asset</th>
              <th className="px-4 py-3">Decision</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className={`border-t border-[var(--border)] ${
                  entry.id === selectedId ? "bg-violet-500/5" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-left font-semibold text-violet-500"
                    onClick={() => setSelectedId(entry.id)}
                  >
                    {entry.id}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/brs/asset/${entry.asset_id}`} className="text-sm font-medium">
                    {entry.asset_id}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize">{entry.decision.replace("_", " ")}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {selected ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                Audit detail
              </p>
              <h2 className="text-xl font-semibold">{selected.id}</h2>
            </div>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-[var(--muted)]">Model version</dt>
                <dd className="font-semibold">{selected.model_version}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Decision</dt>
                <dd className="font-semibold capitalize">{selected.decision.replace("_", " ")}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Owner</dt>
                <dd className="font-semibold">{selected.owner}</dd>
              </div>
            </dl>
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                Notes
              </p>
              <p className="text-sm">{selected.notes}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                Evidence
              </p>
              <ul className="mt-2 space-y-2">
                {selected.evidence.map((item, index) => (
                  <li key={`${item.label}-${index}`} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm">
                    <span className="font-semibold">{item.label}</span>
                    <p className="text-xs text-[var(--muted)]">{item.url}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)]">Select an audit to view detail.</p>
        )}
      </div>
    </div>
  );
}
