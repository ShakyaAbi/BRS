const path = require("path");

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");

module.exports = {
  ROOT_DIR,
  DATA_DIR,
  PUBLIC_DIR,
  JOBS_FILE,
};
