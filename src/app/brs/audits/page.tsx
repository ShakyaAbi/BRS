import { AuditsPanel } from "@/components/brs/AuditsPanel";
import { getAudits } from "@/lib/mock";

export default async function AuditsPage() {
  const audits = await getAudits();
  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Audits</p>
        <h1 className="text-2xl font-semibold">Evidence locker</h1>
        <p className="text-sm text-[var(--muted)]">
          Every decision has an audit trail with evidence crops and model versions.
        </p>
      </header>
      <AuditsPanel entries={audits} />
    </section>
  );
}
