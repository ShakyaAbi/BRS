const { nanoid } = require("nanoid");
const { readJson, writeJson } = require("./fileStore");
const { JOBS_FILE } = require("./paths");

async function ensureJobsFile() {
  await readJson(JOBS_FILE, []);
}

function serializeJob(job) {
  return {
    id: job.id,
    asset_id: job.asset_id,
    status: job.status,
    created_at: job.created_at,
    updated_at: job.updated_at,
    payload: job.payload,
    scorecard: job.scorecard ?? null,
    error: job.error ?? null,
  };
}

async function listJobs(limit = 50) {
  const jobs = await readJson(JOBS_FILE, []);
  return jobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, limit);
}

async function getJob(jobId) {
  const jobs = await readJson(JOBS_FILE, []);
  return jobs.find((job) => job.id === jobId || job.asset_id === jobId) ?? null;
}

async function saveJobs(jobs) {
  await writeJson(JOBS_FILE, jobs);
}

async function createJob(payload) {
  const jobs = await readJson(JOBS_FILE, []);
  const jobId = `job_${nanoid(8)}`;
  const assetId = payload.asset_id || `asset_${nanoid(6)}`;
  const now = new Date().toISOString();
  const job = {
    id: jobId,
    asset_id: assetId,
    status: "queued",
    created_at: now,
    updated_at: now,
    payload: {
      ...payload,
      asset_id: assetId,
    },
    scorecard: null,
  };
  jobs.push(job);
  await saveJobs(jobs);
  return serializeJob(job);
}

async function updateJob(jobId, updater) {
  const jobs = await readJson(JOBS_FILE, []);
  const index = jobs.findIndex((job) => job.id === jobId);
  if (index === -1) {
    return null;
  }
  const updated = updater({ ...jobs[index] });
  updated.updated_at = new Date().toISOString();
  jobs[index] = updated;
  await saveJobs(jobs);
  return serializeJob(updated);
}

async function claimNextJob() {
  const jobs = await readJson(JOBS_FILE, []);
  const index = jobs.findIndex((job) => job.status === "queued");
  if (index === -1) return null;
  jobs[index].status = "processing";
  jobs[index].updated_at = new Date().toISOString();
  await saveJobs(jobs);
  return serializeJob(jobs[index]);
}

async function completeJob(jobId, scorecard) {
  return updateJob(jobId, (job) => ({
    ...job,
    status: "completed",
    scorecard,
  }));
}

async function failJob(jobId, errorMessage) {
  return updateJob(jobId, (job) => ({
    ...job,
    status: "failed",
    error: errorMessage,
  }));
}

module.exports = {
  ensureJobsFile,
  listJobs,
  getJob,
  createJob,
  claimNextJob,
  completeJob,
  failJob,
};
