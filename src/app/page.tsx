"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import gsap from "gsap";
import CardNav, { type CardNavItem } from "@/components/CardNav";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";

const features = [
  {
    title: "Tone Fidelity",
    body: "Signature clusters compare every caption to brand-approved embeddings in pgvector.",
  },
  {
    title: "IP Risk",
    body: "GroundingDINO + allow/deny rules flag restricted landmarks, logos, and phrases.",
  },
  {
    title: "Human Resonance",
    body: "Uncanny detector blends visual artifact checks with text perplexity + burstiness.",
  },
];

const steps = [
  {
    label: "01",
    title: "Ingest & Embed",
    detail: "Guides, exclusions, and past wins stream in, chunked, and embedded for retrieval.",
  },
  {
    label: "02",
    title: "Score & Explain",
    detail: "Tone/IP/Inclusive/Auth/Lift services emit JSON scorecards with evidence crops.",
  },
  {
    label: "03",
    title: "Approve or Reroll",
    detail: "Dashboard + Slack alerts let reviewers ship compliant assets or trigger alternates.",
  },
];

const navItemsDark: CardNavItem[] = [
  {
    label: "Dashboard",
    bgColor: "#0b1730",
    textColor: "#f8fafc",
    links: [
      { label: "Live gauges", href: "/brs/dashboard", ariaLabel: "Open dashboard" },
      { label: "Alerts feed", href: "/brs/dashboard#alerts", ariaLabel: "View alerts" },
    ],
  },
  {
    label: "Scorecards",
    bgColor: "#1f0f2e",
    textColor: "#fde68a",
    links: [
      { label: "Asset detail", href: "/brs/asset/asset-123", ariaLabel: "See asset detail" },
      { label: "History", href: "/brs/history", ariaLabel: "View score history" },
    ],
  },
  {
    label: "Integrations",
    bgColor: "#2a1d43",
    textColor: "#c4b5fd",
    links: [
      { label: "Webhook spec", href: "#how-it-works", ariaLabel: "Jump to workflow" },
      { label: "Pilot call", href: "mailto:pilot@brandresonance.ai", ariaLabel: "Email pilot team" },
    ],
  },
];

const navItemsLight: CardNavItem[] = [
  {
    label: "Dashboard",
    bgColor: "#f5f3ff",
    textColor: "#1e1b4b",
    links: [
      { label: "Live gauges", href: "/brs/dashboard", ariaLabel: "Open dashboard" },
      { label: "Alerts feed", href: "/brs/dashboard#alerts", ariaLabel: "View alerts" },
    ],
  },
  {
    label: "Scorecards",
    bgColor: "#fff7ed",
    textColor: "#7c2d12",
    links: [
      { label: "Asset detail", href: "/brs/asset/asset-123", ariaLabel: "See asset detail" },
      { label: "History", href: "/brs/history", ariaLabel: "View score history" },
    ],
  },
  {
    label: "Integrations",
    bgColor: "#f3f4f6",
    textColor: "#1f2937",
    links: [
      { label: "Webhook spec", href: "#how-it-works", ariaLabel: "Jump to workflow" },
      { label: "Pilot call", href: "mailto:pilot@brandresonance.ai", ariaLabel: "Email pilot team" },
    ],
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme ?? "dark";
  const isDark = theme === "dark";
  const navItems = isDark ? navItemsDark : navItemsLight;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      );
      gsap.fromTo(
        ".hero-pill",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2 },
      );
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3 + index * 0.1,
            ease: "power2.out",
          },
        );
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground" ref={heroRef}>
      <CardNav
        logo="/favicon.ico"
        logoAlt="Brand Resonance Synth"
        items={navItems}
        baseColor={isDark ? "rgba(6,9,20,0.75)" : "rgba(255,255,255,0.9)"}
        menuColor={isDark ? "#f8fafc" : "#0f172a"}
        buttonBgColor={isDark ? "#fde047" : "#0f172a"}
        buttonTextColor={isDark ? "#0f172a" : "#f8fafc"}
        floating={false}
        className="sticky top-4 z-50 mx-auto w-[90%] max-w-[800px] md:top-8"
      />

      <div className="relative mx-auto mt-8 max-w-6xl px-6 pb-10 pt-6 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.5em] text-[var(--muted-foreground)]">BRS</p>
            <h1 className="text-xl font-semibold text-[var(--foreground)]">Brand Resonance Synth</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/brs/dashboard"
              className="text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
            >
              View Dashboard
            </Link>
            <Button asChild>
              <Link href="/brs/dashboard">Launch Scorecard</Link>
            </Button>
          </div>
        </header>

        <main id="main" className="mt-12 space-y-24">
          <section className="relative overflow-hidden rounded-[40px] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[0_40px_120px_rgba(15,23,42,0.2)] backdrop-blur">
            <div className="hero-pill inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)]/50 px-4 py-2 text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">
              Creative QA
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <div className="hero-title mt-6 space-y-6">
              <h2 className="text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Score every AI asset for tone, IP risk, inclusivity, lift, and authenticity.
              </h2>
              <p className="max-w-2xl text-lg text-[var(--muted-foreground)]">
                BRS ingests style guides, exclusions, and historical wins—then delivers actionable edits, compliant alternates, and audit-ready evidence in under two seconds.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/brs/dashboard">Try the live dashboard</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { label: "Tone Match", value: "92%" },
                { label: "Authenticity Alerts", value: "120+" },
                { label: "Avg. SLA", value: "1.3s" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center"
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                >
                  <p className="text-sm uppercase tracking-[0.4em] text-[var(--muted-foreground)]">{stat.label}</p>
                  <p className="mt-3 text-4xl font-semibold text-[var(--foreground)]">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute -right-32 -top-16 h-64 w-64 rounded-full bg-violet-500/30 blur-[120px]" />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-orange-500/20 blur-[140px]" />
          </section>

          <section id="pillars" className="space-y-8">
            <CardLabel>Five Pillars</CardLabel>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                  ref={(el) => {
                    cardRefs.current[index + 3] = el;
                  }}
                >
                  <p className="text-sm uppercase tracking-[0.4em] text-[var(--muted-foreground)]">
                    {feature.title}
                  </p>
                  <p className="mt-4 text-lg font-semibold">{feature.title}</p>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{feature.body}</p>
                </Card>
              ))}
            </div>
          </section>

          <section id="how-it-works" className="space-y-8">
            <CardLabel>Workflow</CardLabel>
            <div className="space-y-6">
              {steps.map((step) => (
                <div
                  key={step.label}
                  className="flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--foreground)] md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] text-lg font-semibold text-[var(--foreground)]">
                      {step.label}
                    </span>
                    <div>
                      <p className="text-lg font-semibold">{step.title}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{step.detail}</p>
                    </div>
                  </div>
                  <Button asChild variant="ghost" className="text-sm text-[var(--muted-foreground)]">
                    <Link href="/brs/dashboard">View in dashboard</Link>
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-[var(--border)] bg-gradient-to-br from-violet-600/80 to-orange-500/70 p-10 text-center text-white shadow-[0_40px_120px_rgba(124,58,237,0.35)]">
            <p className="text-sm uppercase tracking-[0.4em] text-white/80">Ready to pilot?</p>
            <h3 className="mt-4 text-3xl font-semibold">Plug BRS between generation and delivery.</h3>
            <p className="mt-3 text-white/90">
              Score every drop, stream alerts to Slack, and keep IP/compliance in the loop without slowing ideation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/brs/dashboard">Open live demo</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href="mailto:pilot@brandresonance.ai">Book a pilot</a>
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
