# BRS Bolt Build Context (Next.js)

## Summary
Brand Resonance Synth (BRS) is a “creative QA” layer that scores AI assets for Tone, IP Risk, Inclusivity, Predicted Lift, and Authenticity, then returns actionable edits and optional alternates. Build a polished, responsive dashboard using Next.js App Router, Tailwind, and TypeScript.

## Target Users
- Marketing/brand reviewers who approve AI-generated assets.
- PMs looking for fast, evidence-backed accept/flag decisions.

## Tech & Constraints
- Next.js 14+ (App Router), TypeScript, TailwindCSS, ESLint, next-themes (dark mode via `class`).
- Prefer Server Components; mark interactive parts with "use client".
- No external UI kits. Use `lucide-react` for icons if needed.
- Mock-first: read JSON from `public/mock` during UI build. Swap to API last.

## Information Architecture (Routes)
- `/brs/dashboard` — Overview: five pillar gauges, recent alerts, quick filters.
- `/brs/asset/[id]` — Asset preview, scores, tabs (Tone/IP/Inclusive/Lift/Auth), edits, alternates, evidence crops.
- `/brs/submit` — URL/file input, selectors (type/brand/audience), submit, show `job_id` and link to History.
- `/brs/history` — Paginated table of scored assets with filters and status.
- `/brs/settings` — Sliders for pillar weights; JSON editors for allow/deny lists.
- `/brs/audits` — Audit log: model version, evidence, decision, timestamps.

## Components (Location: `components/brs/*`)
- `Sidebar.tsx`, `TopNav.tsx` (client): navigation, brand switcher, theme toggle.
- `ScoreGauge.tsx` (client): props `{ label: string; value: number; trend?: 'up'|'down'|null; size?: 'sm'|'md'|'lg' }`.
- `AlertList.tsx` (server): props `{ alerts: {type:string; message:string}[] }`.
- `EditList.tsx` (server): props `{ edits: {message:string; severity:'low'|'medium'|'high'}[] }`.
- `AlternateCard.tsx` (client): props `{ suggestion: string; type: 'text'|'image' }`.
- `EvidenceGrid.tsx` (server): props `{ items: {thumbnail:string; label:string}[] }`.
- `DataTable.tsx` (server): generic table with column/row props.

## Data Schema (TypeScript)
- `Scorecard`:
```ts
export type PillarScores = { tone:number; ip_risk:number; inclusivity:number; lift:number; authenticity:number };
export type Alert = { type:'authenticity'|'ip'|'tone'|'inclusive'; message:string };
export type Edit = { message:string; severity:'low'|'medium'|'high' };
export type Alternate = { type:'text'|'image'; suggestion:string };
export type Evidence = { thumbnail:string; label:string };
export type Scorecard = {
  scores: PillarScores;
  alerts: Alert[];
  edits: Edit[];
  alternates: Alternate[];
  evidence: Evidence[];
  metadata: { brand:string; market:'APAC'|'EMEA'|'NA'; type:'text'|'image'|'video' };
};
```
- API (gateway, for later wiring):
  - POST `/v1/assets/score` → `{ job_id }`
  - GET `/v1/jobs/:id` → `{ asset_id, scores, alerts, edits, alternates, evidence }`

## Mock Files (place under `public/mock`)
- `dashboard.json` — summary gauges + recent alerts.
- `asset-123.json` — full `Scorecard` example for one asset.
- `history.json` — array of { id, brand, type, created_at, status }.
- `settings.json` — pillar weights `{ tone:0.3, ip_risk:0.25, inclusivity:0.15, lift:0.15, authenticity:0.15 }` + allow/deny lists.
- `audits.json` — array with model_version, evidence links, decisions.

## Example Scorecard JSON
```json
{
  "scores": {"tone": 0.82, "ip_risk": 0.12, "inclusivity": 0.76, "lift": 0.09, "authenticity": 0.31},
  "alerts": [{"type": "authenticity", "message": "Image feels uncanny (hand artifacts)"}],
  "edits": [
    {"message": "Reduce hyperbole for APAC audience.", "severity": "medium"},
    {"message": "Replace skyline—restricted landmark detected.", "severity": "high"}
  ],
  "alternates": [{"type": "text", "suggestion": "A calmer, benefit‑first headline without superlatives."}],
  "evidence": [{"thumbnail": "/mock/crops/logo.png", "label": "logo crop"}],
  "metadata": {"brand": "Acme", "market": "APAC", "type": "image"}
}
```

## Styling & Tokens
- Spacing: 4, 8, 12, 16, 20, 24
- Type: sm, base, lg, xl, 2xl
- Color roles: surface, subtle, primary, warning, danger, success (dark variants via Tailwind)
- Radius: sm=6px, md=10px; Shadows: xs/sm/md; Motion: fast=100ms, base=160ms
- Dark mode: `next-themes` with `attribute="class"`

## Layout & Files
- `app/layout.tsx` — html/body with ThemeProvider; global styles.
- `app/brs/layout.tsx` — sidebar + top nav + `main` slot.
- `app/brs/dashboard/page.tsx` — gauges + recent alerts (read `/mock/dashboard.json`).
- `app/brs/asset/[id]/page.tsx` — preview, gauges, tabs, alternates, evidence (read `/mock/asset-123.json`).
- `app/brs/submit/page.tsx` (client) — inputs, selectors, submit → show `job_id`.
- `app/brs/history/page.tsx` — table with filters (read `/mock/history.json`).
- `app/brs/settings/page.tsx` (client) — sliders + JSON editors (read/write `/mock/settings.json` for demo).
- `app/brs/audits/page.tsx` — table + detail drawer (read `/mock/audits.json`).
- `components/brs/*` — components listed above.
- `lib/types.ts` — types above; `lib/api.ts` — axios wrapper (toggle MOCK mode).

## Accessibility & Performance
- Proper landmarks (`header`, `nav`, `main`), keyboard focus, skip links.
- ARIA labels on gauges and tabs. Color contrast AA.
- Lazy-load heavy routes (Asset Detail, Audits). Skeletons for loading.

## Acceptance Criteria
- All pages render with mock data; no TypeScript errors.
- Gauges show values (0..1; lift displayed as −1..+1 with up/down trend).
- Asset Detail shows at least one authenticity alert and one alternate.
- Settings sliders update displayed weighted sum; JSON editors validate.
- History/Audits tables paginate and link to Asset Detail.
- Dark mode toggle works globally; responsive at md and lg.

## Non‑Goals (MVP)
- Real-time video analysis; advanced MMM; multi-brand auth flows.
- External UI frameworks; global state libraries.

## Notes for Later Wiring
- Replace mock fetchers with real endpoints; pass `callback_url` to POST `/v1/assets/score`.
- Cache by asset hash; send Slack/Teams alerts on high-severity flags.
