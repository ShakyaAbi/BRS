import { ALERT_ICONS } from "./navConfig";
import type { Alert } from "@/lib/types";

interface AlertListProps {
  alerts: Alert[];
}

export function AlertList({ alerts }: AlertListProps) {
  if (!alerts?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-[var(--muted)]">
        No alerts for this asset.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {alerts.map((alert, index) => {
        const Icon = ALERT_ICONS[alert.type] ?? ALERT_ICONS.authenticity;
        return (
          <li
            key={`${alert.type}-${index}`}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm backdrop-blur"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                alert.type === "authenticity"
                  ? "bg-rose-500/10 text-rose-500"
                  : alert.type === "ip"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-sky-500/10 text-sky-500"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                {alert.type}
              </p>
              <p className="font-medium text-[var(--foreground)]">{alert.message}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
