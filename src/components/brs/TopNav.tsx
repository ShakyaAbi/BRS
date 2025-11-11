"use client";

import { useTheme } from "next-themes";
import { Bell, Moon, Search, SunMedium } from "lucide-react";
import { useState } from "react";

export function TopNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2">
          <Search className="h-4 w-4 text-[var(--muted)]" />
          <input
            aria-label="Search assets"
            className="flex-1 bg-transparent text-sm focus:outline-none"
            placeholder="Search assets, alerts, owners"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)]"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <SunMedium className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
        <p>
          Latency P95: <span className="font-semibold text-[var(--foreground)]">1.3s</span>
        </p>
        <p>
          Cost / 100 assets: <span className="font-semibold text-[var(--foreground)]">$7.42</span>
        </p>
        <p>
          Fal AI credits remaining: <span className="font-semibold text-[var(--foreground)]">63%</span>
        </p>
      </div>
    </header>
  );
}
