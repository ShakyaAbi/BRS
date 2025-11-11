# Brand Resonance Synth (BRS)

Brand Resonance Synth is an AI-native "creative QA" dashboard that scores every asset across Tone Fidelity, IP Risk, Inclusivity, Predicted Lift, and Authenticity. The hackathon build returns actionable edits, authenticity evidence, and webhook-friendly responses powered by mock data so the workflow can be demoed end-to-end.

## Features
- **Dashboard (/brs/dashboard):** pillar gauges, live alerts, and recent assets backed by `public/mock/dashboard.json`.
- **Asset Detail (/brs/asset/[id]):** preview, five-signal gauges, alerts, edits, alternates, and evidence crops.
- **Submit Flow (/brs/submit):** drag/drop uploads to `/api/upload`, progress bars, and mocked POST `/v1/assets/score` responses.
- **History & Audits:** filterable table with deep links plus audit log with evidence drawer.
- **Settings:** editable pillar weights, notification toggles, allow/deny editors, persistence, guide uploads, and one-click cluster rebuilds.
- **Dark mode:** powered by `next-themes` with global tokens defined in `globals.css`.
- **Gateway + Worker:** lightweight Express gateway (`server/gateway`) plus mock worker (`server/worker`) simulate `/v1/assets/score` + `/v1/jobs/:id` flow with a disk-backed queue (`data/jobs.json`).

## Tech Stack
- Next.js 16 (App Router, Server + Client Components)
- TypeScript, Tailwind CSS v4 tokens
- next-themes, lucide-react, axios
- Mock data served from `public/mock/*` with helpers in `src/lib/mock.ts`
- Persistence helpers + file shims in `src/lib/settings-store.ts`, `src/lib/guides-store.ts`, and `src/lib/cluster-store.ts`

## Local Development
```bash
npm install          # already run for you
npm run dev          # start the web app on http://localhost:3000
npm run lint         # eslint (@next/next + typescript rules)
npm run build        # production build
npm run dev:gateway  # Express gateway on http://localhost:4000
npm run dev:worker   # Mock worker that processes jobs from data/jobs.json
```

### Environment
Copy `.env.example` to `.env.local` (and `.env` for the gateway/worker) to keep the dashboard and gateway in sync:
```bash
cp .env.example .env.local
cp .env.example .env
```
`BRS_GATEWAY_TOKEN` secures the gateway; the frontend reads `NEXT_PUBLIC_GATEWAY_TOKEN` and sends it as an `x-api-token` header. Leave the token blank if you truly want an open gateway for local tinkering.

### Mock API Helpers
`src/lib/api.ts` exposes `requestScore`, which by default calls the mocked worker (`submitMockJob`). Toggle `NEXT_PUBLIC_USE_MOCK=false` to point to a real gateway via `NEXT_PUBLIC_API_BASE`.

### Directory Highlights
- `src/app/brs/*` — App Router routes for dashboard, asset detail, submit, history, settings, and audits
- `src/components/brs/*` — Sidebar, TopNav, ScoreGauge, AlertList, DataTable, Settings/Audits/History helpers
- `src/lib/*` — Type definitions, utility helpers, persistence helpers, and mock job simulator
- `public/mock/*` — JSON fixtures plus lightweight SVG evidence crops/assets used across pages
- `src/app/api/*` — Upload, settings, guide, and cluster management endpoints
- `server/*` — Express gateway, worker, and shared job/scorecard stores

## Demo Flow
1. Visit `/brs/dashboard` to review the five pillars and recent alerts.
2. Open `/brs/asset/asset-123` for full scorecard context and evidence.
3. Submit a new asset under `/brs/submit` to get a `job_id` response for webhook demos.
4. Track historical scorecards in `/brs/history` and pull audit evidence from `/brs/audits`.
5. Tune brand weights under `/brs/settings` to see immediate impact on total weighting.

## Brand Config Backend Plan
- **Data layer:** PostgreSQL + pgvector with tables defined in `db/brand-config.sql` (`brands`, `guides`, `rules`, `clusters`, `cluster_jobs`).
- **API surface:** `POST /api/upload`, `GET/PUT /api/settings`, `GET/POST /api/guides`, `POST /api/clusters/rebuild`, and external `/v1/assets/score` + `/v1/jobs/:id` gateway routes (local shims write to `data/*.json` and `public/uploads/*`, production should wire to Express/worker stack).
- **Storage:** Assets + guides stream to S3/MinIO (local shim saves under `public/uploads`); metadata lives in Postgres with pgvector clusters, while `data/*.json` keeps dev persistence in sync with the UI.
