const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { ensureJobsFile, createJob, getJob, listJobs } = require("../lib/jobStore");

const PORT = process.env.GATEWAY_PORT || 4000;
const API_TOKEN = process.env.BRS_GATEWAY_TOKEN || null;

function authMiddleware(req, res, next) {
  if (!API_TOKEN) return next();

  const headerToken =
    req.get("x-api-token") ||
    (req.get("authorization")?.startsWith("Bearer ")
      ? req.get("authorization").slice("Bearer ".length)
      : null);

  if (headerToken !== API_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
}

async function start() {
  await ensureJobsFile();

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "5mb" }));
  app.use(morgan("dev"));

  app.get("/healthz", (req, res) => {
    res.json({ status: "ok", service: "brs-gateway" });
  });

  app.use(authMiddleware);

  app.post("/v1/assets/score", async (req, res) => {
    const { brand_id, type, uri, metadata, title, audience, asset_id } = req.body || {};
    if (!brand_id || !type || (!uri && !asset_id)) {
      return res.status(400).json({ error: "brand_id, type, and uri (or asset_id) are required" });
    }

    const job = await createJob({
      brand_id,
      type,
      uri,
      metadata: metadata || { audience },
      title,
      asset_id,
    });

    res.status(202).json({ job_id: job.id, status: job.status, asset_id: job.asset_id });
  });

  app.get("/v1/jobs", async (req, res) => {
    const { limit } = req.query;
    const jobs = await listJobs(limit ? Number(limit) : 50);
    res.json({ items: jobs });
  });

  app.get("/v1/jobs/:id", async (req, res) => {
    const job = await getJob(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "job not found" });
    }
    res.json(job);
  });

  app.listen(PORT, () => {
    console.log(`BRS gateway listening on http://localhost:${PORT}`);
  });
}

start();
