import fs from "fs/promises";
import { SETTINGS_FILE, SETTINGS_FALLBACK, DATA_DIR } from "./server-paths";
import type { SettingsData } from "./types";

async function ensureSettingsFile() {
  try {
    await fs.access(SETTINGS_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const fallback = await fs.readFile(SETTINGS_FALLBACK, "utf-8");
    await fs.writeFile(SETTINGS_FILE, fallback, "utf-8");
  }
}

export async function readSettings(): Promise<SettingsData> {
  await ensureSettingsFile();
  const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
  return JSON.parse(raw) as SettingsData;
}

export async function writeSettings(data: SettingsData): Promise<SettingsData> {
  await ensureSettingsFile();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2));
  return data;
}
