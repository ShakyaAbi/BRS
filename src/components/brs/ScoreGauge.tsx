"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { PillarTrend } from "@/lib/types";
import { formatPercent, formatTrendLabel } from "@/lib/utils";

const SIZE_MAP = {
  sm: 96,
  md: 140,
  lg: 180,
} as const;

interface ScoreGaugeProps {
  label: string;
  value: number;
  trend?: PillarTrend;
  size?: keyof typeof SIZE_MAP;
  variant?: "default" | "inverse";
}

export function ScoreGauge({
  label,
  value,
  trend = null,
  size = "md",
  variant = "default",
}: ScoreGaugeProps) {
  const pixels = SIZE_MAP[size];
  const clamped = Math.max(0, Math.min(1, value));
  const stroke = `${clamped * 360}deg`;
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const isSoft = variant === "inverse";
  const ringColors = isSoft
    ? { primary: "rgba(16,185,129,0.9)", track: "rgba(16,185,129,0.15)" }
    : { primary: "rgba(129,140,248,1)", track: "rgba(99,102,241,0.18)" };

  return (
    <div
      className="flex flex-col items-center gap-3 text-center"
      role="img"
      aria-label={`${label} score ${formatPercent(clamped, 0)}, ${formatTrendLabel(trend)}`}
    >
      <div
        className="relative flex items-center justify-center rounded-full shadow-[0_20px_60px_rgba(15,23,42,0.4)]"
        style={{
          width: pixels,
          height: pixels,
          background: `conic-gradient(${ringColors.primary} ${stroke}, ${ringColors.track} ${stroke})`,
        }}
      >
        <div
          className="flex flex-col items-center justify-center rounded-full text-3xl font-semibold text-[var(--foreground)]"
          style={{
            width: pixels - 30,
            height: pixels - 30,
            backgroundColor: "rgba(3,7,18,0.9)",
            boxShadow: "inset 0 0 25px rgba(15,23,42,0.75)",
          }}
        >
          <span>{Math.round(clamped * 100)}</span>
          <span className="text-xs uppercase tracking-wide text-[var(--muted)] align-top">
            {variant === "inverse" ? "lift" : "%"}
          </span>
        </div>
        {trend && TrendIcon && (
          <span
            className={`absolute -right-2 -top-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              trend === "up" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}
          >
            <TrendIcon className="h-3 w-3" />
            {trend === "up" ? "+" : "-"}
          </span>
        )}
      </div>
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-[var(--muted)]">
          {isSoft ? "Confidence delta" : "0 = risk, 100 = best"}
        </p>
      </div>
    </div>
  );
}
