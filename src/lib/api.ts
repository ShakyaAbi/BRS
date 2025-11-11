import axios from "axios";
import { submitMockJob } from "./mock-job";
import type { SubmitPayload } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
const FORCE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const GATEWAY_TOKEN = process.env.NEXT_PUBLIC_GATEWAY_TOKEN;

export async function requestScore(payload: SubmitPayload) {
  if (!FORCE_MOCK) {
    try {
      const response = await axios.post(
        `${API_BASE}/v1/assets/score`,
        {
          brand_id: payload.brandId,
          type: payload.type,
          uri: payload.assetUrl,
          metadata: {
            audience: payload.audience,
            notes: payload.notes,
          },
          title: payload.notes ? payload.notes.slice(0, 40) : undefined,
        },
        {
          headers: GATEWAY_TOKEN
            ? {
                "x-api-token": GATEWAY_TOKEN,
              }
            : undefined,
        },
      );
      return response.data as { job_id: string; status: string; asset_id: string };
    } catch (error) {
      console.warn("Gateway request failed, falling back to mock job.", error);
    }
  }

  return submitMockJob();
}
