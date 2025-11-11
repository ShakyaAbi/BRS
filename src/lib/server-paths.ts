import path from "path";

const ROOT_DIR = process.cwd();

export const DATA_DIR = path.join(ROOT_DIR, "data");
export const PUBLIC_DIR = path.join(ROOT_DIR, "public");
export const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");
export const ASSET_UPLOAD_DIR = path.join(UPLOADS_DIR, "assets");
export const GUIDE_UPLOAD_DIR = path.join(UPLOADS_DIR, "guides");
export const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
export const GUIDES_FILE = path.join(DATA_DIR, "guides.json");
export const CLUSTER_META_FILE = path.join(DATA_DIR, "cluster-meta.json");
export const SETTINGS_FALLBACK = path.join(PUBLIC_DIR, "mock", "settings.json");
export const JOBS_FILE = path.join(DATA_DIR, "jobs.json");
