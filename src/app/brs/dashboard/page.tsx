import { AlertList } from "@/components/brs/AlertList";
import { DataTable, type Column } from "@/components/brs/DataTable";
import { ScoreGauge } from "@/components/brs/ScoreGauge";
import { Card, CardLabel } from "@/components/ui/card";
import { getDashboardSummary } from "@/lib/mock";
import type { RecentAsset } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const recentColumns: Column<RecentAsset>[] = [
  {
    key: "name",
    label: "Asset",
    render: (row) => (
      <div>
        <p className="font-semibold">{row.name}</p>
        <p className="text-xs text-[var(--muted)]">
          {row.brand} • {row.type.toUpperCase()}
        </p>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-[var(--foreground)]"
        data-status={row.status}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            row.status === "flagged"
              ? "bg-rose-500"
              : row.status === "ready"
                ? "bg-emerald-400"
                : "bg-amber-400"
          }`}
        />
        {row.status}
      </span>
    ),
  },
  {
    key: "score",
    label: "Score",
    render: (row) => (
      <span className="text-base font-semibold text-[var(--foreground)]">{Math.round(row.score * 100)}</span>
    ),
  },
  {
    key: "updated_at",
    label: "Updated",
    render: (row) => (
      <span className="text-xs text-[var(--muted)]">
        {formatDate(row.updated_at)}
      </span>
    ),
  },
];

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <section className="space-y-8">
      <Card className="flex flex-wrap items-center justify-between gap-4 border-white/10 bg-white/5 text-[var(--foreground)]">
        <div>
          <CardLabel className="tracking-[0.4em] text-[var(--muted)]">Overview</CardLabel>
          <h1 className="mt-2 text-2xl font-semibold">Pixel Riot creative QA health</h1>
          <p className="text-sm text-[var(--muted)]">Weights synced to demo sandbox</p>
        </div>
        <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-[var(--muted)]">
          <p className="uppercase tracking-wide text-[var(--muted)]">Last refresh</p>
          <p className="text-base font-semibold text-[var(--foreground)]">
            {formatDate(summary.updated_at)}
          </p>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-5">
        {summary.gauges.map((gauge) => (
          <Card
            key={gauge.label}
            className="border-white/10 bg-gradient-to-br from-white/10 via-white/[0.04] to-white/[0.02] px-4 py-6 text-[var(--foreground)]"
          >
            <ScoreGauge
              label={gauge.label}
              value={gauge.value}
              trend={gauge.trend}
              size="md"
              variant={gauge.label === "Predicted Lift" ? "inverse" : "default"}
            />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/5 p-6 text-[var(--foreground)] lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent assets</h2>
              <p className="text-sm text-[var(--muted)]">
                Scorecards streamed from the worker queue
              </p>
            </div>
            <span className="text-xs text-[var(--muted)]">
              {summary.recentAssets.length} in the last 6 hrs
            </span>
          </div>
          <div className="mt-6">
            <DataTable<RecentAsset>
              caption="Recent assets overview"
              rows={summary.recentAssets}
              columns={recentColumns}
            />
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6 text-[var(--foreground)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Alerts</h2>
              <p className="text-sm text-[var(--muted)]">Streamed from workers</p>
            </div>
            <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-500">
              {summary.alerts.length}
            </span>
          </div>
          <div className="mt-4">
            <AlertList alerts={summary.alerts} />
          </div>
        </Card>
      </div>
    </section>
  );
}
