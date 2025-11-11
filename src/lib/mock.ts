import fs from "fs/promises";
import path from "path";
import { cache } from "react";
import type {
  AuditEntry,
  DashboardSummary,
  HistoryRow,
  Scorecard,
} from "./types";
import { readSettings } from "./settings-store";
import { getStoredJob, getHistoryRows } from "./jobs-data";

const MOCK_DIR = path.join(process.cwd(), "public/mock");

async function readMock<T>(fileName: string): Promise<T> {
  const filePath = path.join(MOCK_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export const getDashboardSummary = cache(() =>
  readMock<DashboardSummary>("dashboard.json"),
);

export const getScorecard = cache(async (assetId: string) => {
  const job = await getStoredJob(assetId);
  if (job?.scorecard) {
    return job.scorecard;
  }
  try {
    return await readMock<Scorecard>(`asset-${assetId}.json`);
  } catch {
    return await readMock<Scorecard>("asset-123.json");
  }
});

export const getHistory = cache(async () => {
  const rows = await getHistoryRows();
  if (rows.length) return rows;
  return readMock<HistoryRow[]>("history.json");
});

export const getSettings = cache(() => readSettings());

export const getAudits = cache(() => readMock<AuditEntry[]>("audits.json"));
