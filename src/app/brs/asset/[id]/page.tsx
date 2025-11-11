import Image from "next/image";
import { AlertList } from "@/components/brs/AlertList";
import { AlternateCard } from "@/components/brs/AlternateCard";
import { EditList } from "@/components/brs/EditList";
import { EvidenceGrid } from "@/components/brs/EvidenceGrid";
import { ScoreGauge } from "@/components/brs/ScoreGauge";
import { getScorecard } from "@/lib/mock";
import type { Pillar } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const LABEL_MAP: Record<Pillar, string> = {
  tone: "Tone Fidelity",
  ip_risk: "IP Risk",
  inclusivity: "Inclusivity",
  lift: "Predicted Lift",
  authenticity: "Authenticity",
};

type AssetPageProps = {
  params: { id: string };
};

export default async function AssetDetailPage({ params }: AssetPageProps) {
  const scorecard = await getScorecard(params.id);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                Asset {scorecard.id}
              </p>
              <h1 className="text-2xl font-semibold">{scorecard.title}</h1>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{scorecard.metadata.brand}</p>
              <p className="text-[var(--muted)]">{scorecard.metadata.market}</p>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
            <Image
              src={scorecard.preview.src}
              alt={scorecard.preview.alt}
              width={1280}
              height={720}
              className="h-72 w-full object-cover"
            />
          </div>
          <dl className="mt-6 grid gap-4 text-sm md:grid-cols-3">
            <div>
              <dt className="text-[var(--muted)]">Owner</dt>
              <dd className="font-semibold">{scorecard.metadata.owner}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Created</dt>
              <dd className="font-semibold">{formatDate(scorecard.metadata.created_at)}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Type</dt>
              <dd className="font-semibold uppercase">{scorecard.metadata.type}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold">Signals</h2>
          <p className="text-sm text-[var(--muted)]">Tone, compliance, authenticity</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {(Object.keys(scorecard.scores) as Pillar[]).map((pillar) => (
              <ScoreGauge
                key={pillar}
                label={LABEL_MAP[pillar]}
                value={scorecard.scores[pillar]}
                size="sm"
                variant={pillar === "lift" ? "inverse" : "default"}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Alerts</h2>
            <span className="text-sm text-[var(--muted)]">
              {scorecard.alerts.length} active
            </span>
          </div>
          <div className="mt-4">
            <AlertList alerts={scorecard.alerts} />
          </div>
        </section>
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recommended edits</h2>
            <span className="text-sm text-[var(--muted)]">
              sequenced by severity
            </span>
          </div>
          <div className="mt-4">
            <EditList edits={scorecard.edits} />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Alternates</h2>
            <span className="text-xs text-[var(--muted)]">
              Model-suggested rerolls
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {scorecard.alternates.map((alternate, index) => (
              <AlternateCard key={`${alternate.type}-${index}`} alternate={alternate} />
            ))}
          </div>
        </section>
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Evidence</h2>
            <span className="text-xs text-[var(--muted)]">Audit-ready</span>
          </div>
          <div className="mt-4">
            <EvidenceGrid items={scorecard.evidence} />
          </div>
        </section>
      </div>
    </div>
  );
}
