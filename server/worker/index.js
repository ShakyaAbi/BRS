const { claimNextJob, completeJob, failJob, ensureJobsFile } = require("../lib/jobStore");
const { generateScorecard } = require("../lib/scoreGenerator");

const POLL_MS = Number(process.env.WORKER_POLL_MS || 2000);

async function processJob(job) {
  console.log(`[worker] Processing ${job.id}`);
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const scorecard = generateScorecard(job);
    await completeJob(job.id, scorecard);
    console.log(`[worker] Completed ${job.id}`);
  } catch (error) {
    console.error(`[worker] Failed ${job.id}`, error);
    await failJob(job.id, error?.message || "Unknown error");
  }
}

async function tick() {
  const job = await claimNextJob();
  if (job) {
    await processJob(job);
  }
  setTimeout(tick, POLL_MS);
}

async function start() {
  await ensureJobsFile();
  console.log("BRS worker listening for jobs...");
  tick();
}

start();
