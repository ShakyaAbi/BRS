import { NextRequest, NextResponse } from "next/server";
import { getClusterMeta, updateClusterMeta } from "@/lib/cluster-store";

export async function POST(request: NextRequest) {
  let payload: unknown = {};
  try {
    payload = await request.json();
  } catch {
    // ignore
  }
  const candidate = payload as { brandIds?: unknown };
  const brandIds: string[] | undefined = Array.isArray(candidate.brandIds)
    ? (candidate.brandIds as string[])
    : undefined;

  const meta = await getClusterMeta();
  const rebuiltAt = new Date().toISOString();
  const updated = await updateClusterMeta({
    ...meta,
    lastRebuiltAt: rebuiltAt,
    activeBrands: brandIds ?? meta.activeBrands,
  });

  return NextResponse.json({
    status: "ok",
    rebuiltAt,
    activeBrands: updated.activeBrands,
  });
}
