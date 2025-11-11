# Brand Resonance Synth (BRS) Context Brief

## Challenge
AI generators routinely drift from brand tone, reuse restricted IP, or feel robotic—forcing heavy manual QA for compliance, authenticity, and cultural fit. Marketers need an automated “creative QA” layer that understands style guides, legal guardrails, and historical performance so they can safely scale ideation.

## Solution Snapshot
Brand Resonance Synth (BRS) is an AI-native middleware that sits between generation tools and final delivery. It ingests style guides, past campaigns, legal exclusions, and audience insights, then scores every copy/image/video across five pillars:
- **Tone Fidelity** – cosine similarity between new asset embeddings and “signature” brand clusters.
- **IP Risk** – logo/landmark detection plus legal allow/deny lists.
- **Inclusivity** – bias markers, representation checks, cultural nuance.
- **Predicted Performance Lift** – lightweight MMM that maps assets to historical cohorts.
- **Human Resonance / Authenticity** – detects uncanny visuals (weird hands, symmetry glitches) and robotic, low-perplexity text.
BRS returns actionable edits (“Reduce hyperbole for APAC”) or authenticity alerts (“Image feels uncanny; re-roll”). It can also suggest compliant alternates.

## Technical Architecture
1. **Ingestion Layer** – FastAPI endpoint normalizes brand guides, assets, exclusions, and insights into PostgreSQL + `pgvector`; creative binaries land in S3/MinIO. Guides are chunked via LangChain and embedded for retrieval.
2. **Signature Clusters** – Historical, brand-approved assets embed through CLIP/LLaVA (visual) and OpenAI GPT-4o-mini or LLaMA (text). K-means/DBSCAN builds “signature” centroids per tone, audience, and format.
3. **Scoring Microservices** – Python/FastAPI services per pillar communicate over RabbitMQ. Each service owns its models: tone classifier, IP detector (GroundingDINO/OWLv2), inclusivity heuristics, uncanny detector (artifact classifier + perplexity model), and Bayesian lift estimator.
4. **Action Engine** – Aggregates scores into a JSON scorecard, attaches recommended edits, and, if enabled, triggers auto-regenerated alternates.
5. **Experience Layer** – React + Tailwind dashboard (bootstrapped in Bolt.new) shows asset preview, score gauges, authenticity warnings, and “approve/needs edit” workflow. Slack/Teams hooks push alerts; REST callbacks let DAMs pull verdicts.

## Credit Utilization
- **Bolt.new ($25 Pro)** – Rapidly scaffold the SPA dashboard, hero sections, and approval modals; export React code back into the repo.
- **Fal AI ($20)** – Run heavy multimodal inference (CLIP/LLaVA embeddings, GroundingDINO logo scans, high-res uncanny predictions). Cache embeddings to avoid repeat spend; freeze models locally after inference.
- **ElevenLabs (promo pending)** – Optional voiceover for authenticity alerts or narrated demo videos (“Asset flagged for uncanny hands—reroll”). If codes lag, stub with open TTS and swap audio later.

## Workflow & Timeline
- **Day 1** – Gather datasets/guides, stand up ingestion + vector store, seed initial signature clusters, define API contract with upstream generators.
- **Day 2** – Implement tone/IP/inclusivity scorers, wire embeddings, build uncanny detector MVP (visual artifact classifier + text perplexity rules), scaffold dashboard via Bolt.new.
- **Day 3** – Add lift estimator, polish remediation copy, record authenticity alerts, prepare demo narrative with two contrasting assets, capture latency + cost metrics.

## Demo Narrative
1. Generator pushes a batch asset → BRS webhook ingests metadata and binaries.
2. Scorecard returns with five confidence meters, actionable edits, and an “Authenticity Warning.”
3. Operator accepts suggested alt or triggers re-roll; Slack/Teams notification confirms compliance-ready status.
4. Dashboard segment highlights learning loop metrics (false-positive feedback, average tone match, lift deltas).
