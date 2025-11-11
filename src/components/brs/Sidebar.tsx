"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { NAV_LINKS } from "./navConfig";
import { cn } from "@/lib/utils";

const BRANDS = ["Pixel Riot", "Glow Collective", "Acme Studios"];

export function Sidebar() {
  const pathname = usePathname();
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0]);

  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] px-4 py-6 text-sm lg:flex">
      <div className="flex items-center gap-2 px-2 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-orange-400 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold leading-tight">Brand Resonance Synth</p>
          <p className="text-xs text-[var(--muted)]">Creative QA</p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <label className="text-[0.7rem] uppercase tracking-wide text-[var(--muted)]">
            Brand
          </label>
          <div className="mt-2 rounded-xl border border-[var(--border)] px-3 py-2">
            <select
              value={selectedBrand}
              onChange={(event) => setSelectedBrand(event.target.value)}
              className="w-full bg-transparent text-sm font-medium focus:outline-none"
            >
              {BRANDS.map((brand) => (
                <option key={brand} value={brand} className="text-black">
                  {brand}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {selectedBrand === "Pixel Riot"
                ? "Weights synced to Pixel Riot demo."
                : "Mock data loaded."}
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-gradient-to-r from-violet-500/20 to-orange-400/20 text-violet-500"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-5 text-white">
        <p className="text-xs uppercase tracking-wide text-slate-300">
          Pilot Stats
        </p>
        <p className="mt-2 text-2xl font-semibold">92%</p>
        <p className="text-sm text-slate-300">Of alerts resolved pre-launch</p>
      </div>
    </aside>
  );
}
