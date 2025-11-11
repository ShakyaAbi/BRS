# Brand Resonance Synth (BRS) — Plan & Context

## Purpose
BRS is a “creative QA” middleware between generative tools and delivery. It scores new assets (text/image/video) against brand tone, IP/compliance, inclusivity, predicted performance lift, and authenticity/human resonance, then returns a scorecard with actionable edits and optional alternates.

## What Success Looks Like
- Faster approvals with fewer manual edits
- Clear authenticity/IP flags with evidence
- Actionable, brand-aligned suggestions that marketers accept
- Cost- and latency-aware scoring flow suitable for demos and pilots

## User Journey (E2E)
1) Generator posts asset + metadata to BRS. 2) BRS ingests, embeds, and scores via microservices. 3) JSON scorecard returns (or webhook callback). 4) Dashboard shows preview, five scores, flags, and suggested edits/alternates. 5) Marketer accepts, re-rolls, or routes to human touch-up.

## Architecture (High Level)
- Ingestion: Normalize brand guides, exclusions, past assets; store in PostgreSQL + pgvector; assets in S3/MinIO.
- Signature Clusters: Build per-brand centroids from approved assets (k-means/DBSCAN over text/image embeddings).
- Scoring Services (FastAPI): tone, ip, inclusivity, uncanny, lift — communicate via RabbitMQ; cache embeddings.
- Action Engine: Aggregates scores, applies brand weights, emits edits/alternates.
- Experience: React + Tailwind dashboard; Slack/Teams alerts; REST webhooks for DAM integration.

## Scoring Pillars (How They Work)
- Tone Fidelity: Cosine similarity to brand “signature clusters” + multi-head classifier; thresholds per brand.
- IP Risk: Open-vocabulary vision (GroundingDINO/OWL-ViT) checks logos/landmarks; allow/deny post-filters; evidence crops.
- Inclusivity: Lexicons + heuristics + LLM rubric; markets/locale aware.
- Authenticity: Visual artifact detector (hands, symmetry, textures) + naturalness; Text roboticness via perplexity/burstiness and diversity.
- Predicted Lift: Bayesian linear regression/LightGBM over cohort features (format, CTA, audience) → expected delta + confidence band.

## Data Model (PostgreSQL + pgvector)
brands, guides (embeddings), assets, embeddings (text/image), clusters, rules (allow/deny), scores (five pillars + details), cohorts, audits (evidence + versions).

## API (Gateway)
- POST `/v1/assets/score`
  - Body: `{ brand_id, type, uri, metadata, callback_url? }`
  - Resp: `{ job_id, status: "queued" }`
- GET `/v1/jobs/{job_id}` → Scorecard
  - Example `scores`: `{ tone: 0.82, ip_risk: 0.12, inclusivity: 0.76, lift: 0.09, authenticity: 0.31 }`
  - `alerts`: `[ { type: "authenticity", message: "Image feels uncanny (hand artifacts)" } ]`
  - `edits`: concise, prioritized suggestions; `alternates`: optional humanized rewrites.

## Tech Stack & Credits
- Models: e5/Instructor embeddings (text), CLIP/LLaVA (image), GroundingDINO/OWL-ViT (logos/landmarks), Llama 3 8B/Mistral (perplexity), optional BRISQUE/NIMA (naturalness).
- Infra: PostgreSQL + pgvector, MinIO/S3, RabbitMQ, Redis cache.
- Services: Python/FastAPI for scorers; Node/Express gateway (fits current repo).
- Credits Use: Bolt.new ($25) for rapid dashboard scaffolding and polish; Fal AI ($20) for heavy multimodal inference (cache embeddings; batch calls); ElevenLabs (promo) for optional voice alerts/demo narration.

## Implementation Plan (Hackathon Timeline)
- Day 1: Ingest guides/exclusions/past assets; set up Postgres + pgvector; build initial signature clusters; define API schema; scaffold dashboard structure in Bolt.new.
- Day 2: Implement tone, IP, inclusivity scorers; Uncanny MVP (visual artifacts + text perplexity); integrate Fal AI for heavy vision; cache embeddings; wire score aggregation.
- Day 3: Add lift estimator; refine edits/alternates; Slack/Teams webhooks; polish UX; record demo; collect latency and $/100-asset metrics.

## KPIs
Approval time reduction, authenticity preference rate, IP false-positive/negative, latency P95, $/100 assets, and marketer adoption of suggestions.

## Risks & Mitigations
Model drift → versioning + recalibration; Over-flagging → per-brand thresholds + human feedback loop; Cost spikes → cache/batch; Legal risk → audit logs with evidence crops and model/version.

## Local Dev (this repo)
- Client: `npm run dev` (Vite), build: `npm run build` → `npm run preview`.
- API: `npm run dev:server` (or `npm run server`).
- Prisma/DB: `npm run prisma:migrate | generate | seed | studio`.
- Lint: `npm run lint`.
- Full stack (incl. scorers when added): `docker compose up --build`.

## Demo Flow (Script)
1) Submit two contrasting assets. 2) Show scorecard and “Authenticity Warning” with evidence crops. 3) Apply suggested alternate. 4) Display latency and cost. 5) Slack confirmation of compliance-ready status.

## Open Questions
1) Default weights for five pillars per brand? 2) Must responses be synchronous or can we callback? 3) Which integrations matter most now (Slack/Teams/DAM)? 4) Can we persist third‑party inference outputs for caching?
