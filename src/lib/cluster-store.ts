import fs from "fs/promises";
import { CLUSTER_META_FILE, DATA_DIR } from "./server-paths";
import type { ClusterMeta } from "./types";

async function ensureClusterFile() {
  try {
    await fs.access(CLUSTER_META_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const seed: ClusterMeta = { lastRebuiltAt: null, activeBrands: [] };
    await fs.writeFile(CLUSTER_META_FILE, JSON.stringify(seed, null, 2));
  }
}

export async function getClusterMeta(): Promise<ClusterMeta> {
  await ensureClusterFile();
  const raw = await fs.readFile(CLUSTER_META_FILE, "utf-8");
  return JSON.parse(raw) as ClusterMeta;
}

export async function updateClusterMeta(meta: ClusterMeta): Promise<ClusterMeta> {
  await ensureClusterFile();
  await fs.writeFile(CLUSTER_META_FILE, JSON.stringify(meta, null, 2));
  return meta;
}
