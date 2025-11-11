const fs = require("fs/promises");
const path = require("path");

async function ensureFile(filePath, fallback = "[]") {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, fallback, "utf-8");
  }
}

async function readJson(filePath, fallback = []) {
  await ensureFile(filePath, JSON.stringify(fallback, null, 2));
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function writeJson(filePath, data) {
  await ensureFile(filePath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  readJson,
  writeJson,
};
