"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { HistoryRow } from "@/lib/types";

const PAGE_SIZE = 3;

interface HistoryTableProps {
  rows: HistoryRow[];
}

export function HistoryTable({ rows }: HistoryTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return rows.filter((row) => statusFilter === "all" || row.status === statusFilter);
  }, [rows, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-2xl border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(event) => {
            setPage(1);
            setStatusFilter(event.target.value);
          }}
        >
          <option value="all">All statuses</option>
          <option value="ready">Ready</option>
          <option value="review">Requires review</option>
          <option value="flagged">Flagged</option>
        </select>
        <span className="text-xs text-[var(--muted)]">
          Showing {pageRows.length} of {filtered.length} assets
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--background)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Asset</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">
                  <Link href={`/brs/asset/${row.id}`} className="font-semibold text-violet-500">
                    {row.id}
                  </Link>
                </td>
                <td className="px-4 py-3">{row.brand}</td>
                <td className="px-4 py-3">{Math.round(row.score * 100)}</td>
                <td className="px-4 py-3 capitalize">{row.status}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          className="rounded-xl border border-[var(--border)] px-3 py-1 disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          className="rounded-xl border border-[var(--border)] px-3 py-1 disabled:opacity-50"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
