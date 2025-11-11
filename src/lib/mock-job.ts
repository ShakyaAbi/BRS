export async function submitMockJob(): Promise<{ job_id: string; status: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const jobId = `job_${Math.random().toString(36).slice(2, 8)}`;
  return { job_id: jobId, status: "queued" };
}
