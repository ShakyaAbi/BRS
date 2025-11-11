import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number, digits = 0) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatScore(value: number) {
  return (value * 100).toFixed(0);
}

export function formatTrendLabel(trend: "up" | "down" | null) {
  if (!trend) return "stable";
  return trend === "up" ? "trending up" : "trending down";
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
