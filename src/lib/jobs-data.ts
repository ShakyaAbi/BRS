import fs from "fs/promises";
import { JOBS_FILE, DATA_DIR } from "./server-paths";
import type { HistoryRow, Scorecard } from "./types";

export type StoredJob = {
  id: string;
  asset_id: string;
  status: "queued" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
  payload: Record<string, unknown>;
  scorecard?: Scorecard | null;
};

async function ensureJobsFile() {
  try {
    await fs.access(JOBS_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(JOBS_FILE, JSON.stringify([], null, 2));
  }
}

async function readJobs(): Promise<StoredJob[]> {
  await ensureJobsFile();
  const raw = await fs.readFile(JOBS_FILE, "utf-8");
  return JSON.parse(raw) as StoredJob[];
}

export async function getStoredJobs(limit = 50): Promise<StoredJob[]> {
  const jobs = await readJobs();
  return jobs
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export async function getStoredJob(id: string): Promise<StoredJob | null> {
  const jobs = await readJobs();
  return jobs.find((job) => job.id === id || job.asset_id === id) ?? null;
}

export async function getHistoryRows(): Promise<HistoryRow[]> {
  const jobs = await getStoredJobs(100);
  if (!jobs.length) return [];
  return jobs.map((job) => ({
    id: job.asset_id,
    brand: String(job.payload?.brand_id || "Pixel Riot"),
    type: (job.payload?.type as HistoryRow["type"]) || "image",
    status: mapStatus(job.status),
    score: job.scorecard ? averageScore(job.scorecard.scores) : Math.random(),
    created_at: job.created_at,
  }));
}

function mapStatus(status: StoredJob["status"]): HistoryRow["status"] {
  if (status === "completed") return "ready";
  if (status === "failed") return "flagged";
  return "review";
}

function averageScore(scores: Scorecard["scores"]): number {
  const values = Object.entries(scores).map(([key, value]) =>
    key === "lift" ? (value + 1) / 2 : value,
  );
  if (!values.length) return 0;
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.max(0, Math.min(1, avg));
}
