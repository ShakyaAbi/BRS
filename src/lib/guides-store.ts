import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { GUIDES_FILE, GUIDE_UPLOAD_DIR, DATA_DIR } from "./server-paths";
import type { Guide } from "./types";

async function ensureGuidesFile() {
  try {
    await fs.access(GUIDES_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(GUIDES_FILE, JSON.stringify([], null, 2));
  }
  await fs.mkdir(GUIDE_UPLOAD_DIR, { recursive: true });
}

export async function getGuides(): Promise<Guide[]> {
  await ensureGuidesFile();
  const raw = await fs.readFile(GUIDES_FILE, "utf-8");
  return JSON.parse(raw) as Guide[];
}

export async function addGuide(
  file: File,
  brandId: string,
): Promise<Guide> {
  await ensureGuidesFile();
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filename = `${Date.now()}-${safeName}`;
  const filePath = path.join(GUIDE_UPLOAD_DIR, filename);
  await fs.writeFile(filePath, bytes);
  const url = `/uploads/guides/${filename}`;
  const newGuide: Guide = {
    id: randomUUID(),
    brandId,
    originalName: file.name,
    filename,
    size: file.size,
    url,
    uploaded_at: new Date().toISOString(),
  };
  const guides = await getGuides();
  guides.unshift(newGuide);
  await fs.writeFile(GUIDES_FILE, JSON.stringify(guides, null, 2));
  return newGuide;
}
