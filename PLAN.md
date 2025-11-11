# Brand Resonance Synth — Build Plan

## Objectives
- Deliver an AI-native "creative QA" layer that scores every asset for Tone Fidelity, IP Risk, Inclusivity, Predicted Lift, and Authenticity.
- Return actionable edits, authenticity warnings, and compliant alternates with audit-ready evidence.
- Provide a polished dashboard + webhook/API workflow suitable for the Pixel Riot demo and future pilots.

## Architecture Snapshot
1. **Gateway (Express/Node)** – Endpoints `/v1/assets/score` and `/v1/jobs/:id`, optional webhook callbacks, upload handling via pre-signed URLs.
2. **Job Orchestrator (Redis/RabbitMQ worker)** – Sequentially invokes scoring modules, caches embeddings, and persists scorecards.
3. **Scoring Modules (Python/FastAPI)**
   - Tone Fidelity: text/image embeddings + signature clusters (pgvector).
   - IP Risk: GroundingDINO/OWL-ViT detections + allow/deny rules.
   - Inclusivity: multilingual lexicon + rubric.
   - Authenticity: visual artifact detector + text perplexity/burstiness.
   - Predicted Lift: LightGBM/Bayesian regression over cohort tags.
4. **Data Layer** – PostgreSQL + pgvector (`brands`, `guides`, `assets`, `embeddings`, `clusters`, `rules`, `scores`, `audits`, `cohorts`), MinIO/S3 for assets, logs for evidence crops.
5. **Experience Layer (Next.js App Router)** – Dashboard, Asset Detail, Submit, History, Settings, Audits; Slack/Teams alerts for high-severity flags.

## Execution Timeline (3-Day Hackathon)
- **Day 1 – Infra & Ingestion**: Stand up Postgres + pgvector, MinIO, Redis; implement uploads + `/v1/assets/score`; ingest guides and past assets; seed signature clusters; scaffold Next.js shell via Bolt.
- **Day 2 – Scoring + UI**: Implement Tone/IP/Inclusive/Auth modules; connect Fal AI for heavy vision; aggregate scorecard JSON; build Dashboard, Asset Detail, Submit pages with mock data.
- **Day 3 – Lift + Polish**: Add lift estimator + action engine; wire Slack alerts; finish History/Settings/Audits pages; switch UI from mocks to API; capture latency/cost metrics; record 90-second demo.

## Workstreams & Owners
- **Data/Models**: Embeddings, clusters, thresholds, Fal AI integration.
- **Backend/API**: Express gateway, worker, score aggregation, webhook, audit logging.
- **Frontend/UX**: Bolt-built Next.js UI, mock mode, responsiveness, dark mode, evidence viewer.
- **DevOps**: Docker Compose, env templates, health checks, logging.
- **Demo & Story**: Script, assets, video, README/IP notes.

## Key Deliverables
- Working API + webhook returning five-signal scorecards, edits, alternates, evidence snapshots.
- Dashboard showing scores, authenticity warnings, history, and config controls.
- Slack/Teams notification flow for authenticity/IP incidents.
- Documentation: README demo guide, IP/licensing note, deployment + env instructions, metrics snapshot.
