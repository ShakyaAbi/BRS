import { HistoryTable } from "@/components/brs/HistoryTable";
import { getHistory } from "@/lib/mock";

export default async function HistoryPage() {
  const rows = await getHistory();

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
          History
        </p>
        <h1 className="text-2xl font-semibold">Scored assets & decisions</h1>
        <p className="text-sm text-[var(--muted)]">
          Filter by status and open the source scorecard without losing context.
        </p>
      </header>

      <HistoryTable rows={rows} />
    </section>
  );
}
