"use client";

import axios from "axios";
import { useCallback, useMemo, useState, useTransition, type ReactNode } from "react";
import { requestScore } from "@/lib/api";
import type { SubmitPayload } from "@/lib/types";
import { cn } from "@/lib/utils";

const BRANDS = [
  { id: "pixel-riot", label: "Pixel Riot" },
  { id: "glow-collective", label: "Glow Collective" },
];

const TYPES: SubmitPayload["type"][] = ["image", "text", "video"];

export default function SubmitPage() {
  const [payload, setPayload] = useState<SubmitPayload>({
    assetUrl: "https://assets.pixelriot.ai/neon-skyline.png",
    brandId: BRANDS[0].id,
    type: "image",
    audience: "APAC creators",
    notes: "Neon Skyline drop built with SDXL",
  });
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">(
    "idle",
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const disableSubmit = useMemo(
    () => !payload.assetUrl || !payload.brandId || !payload.audience || uploadStatus === "uploading",
    [payload, uploadStatus],
  );

  const uploadAsset = useCallback(async (file: File) => {
    setUploadStatus("uploading");
    setUploadProgress(0);
    setUploadError(null);
    setUploadedFile(file.name);

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!event.total) return;
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        },
      });
      setUploadStatus("success");
      setPayload((prev) => ({ ...prev, assetUrl: response.data.url }));
    } catch (err) {
      console.error(err);
      setUploadStatus("error");
      setUploadError("Upload failed. Try again or paste a hosted URL.");
    }
  }, []);

  const submitAsset = () => {
    startTransition(async () => {
      setJobId(null);
      setStatus(null);
      setError(null);
      try {
        const response = await requestScore(payload);
        setJobId(response.job_id);
        setStatus(response.status);
      } catch (err) {
        console.error(err);
        setError("Unable to submit mock job.");
      }
    });
  };

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
          Submit asset
        </p>
        <h1 className="text-2xl font-semibold">Queue a new scorecard</h1>
        <p className="text-sm text-[var(--muted)]">
          Files are streamed to the worker orchestrator; expect Slack alert if flagged.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6"
          onSubmit={(event) => {
            event.preventDefault();
            submitAsset();
          }}
        >
          <div>
            <p className="text-sm font-semibold">Asset upload</p>
            <UploadZone
              status={uploadStatus}
              progress={uploadProgress}
              fileName={uploadedFile}
              error={uploadError}
              onSelectFile={(file) => uploadAsset(file)}
            />
          </div>

          <Field label="Asset URL" hint="Links to S3/MinIO or Fal AI output">
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
              value={payload.assetUrl}
              onChange={(event) => setPayload({ ...payload, assetUrl: event.target.value })}
              required
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Brand">
              <select
                className="w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
                value={payload.brandId}
                onChange={(event) => setPayload({ ...payload, brandId: event.target.value })}
              >
                {BRANDS.map((brand) => (
                  <option key={brand.id} value={brand.id} className="text-black">
                    {brand.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Asset type">
              <select
                className="w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
                value={payload.type}
                onChange={(event) =>
                  setPayload({ ...payload, type: event.target.value as SubmitPayload["type"] })
                }
              >
                {TYPES.map((type) => (
                  <option key={type} value={type} className="text-black">
                    {type}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Audience / market">
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
              value={payload.audience}
              onChange={(event) => setPayload({ ...payload, audience: event.target.value })}
              required
            />
          </Field>

          <Field label="Notes">
            <textarea
              className="w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
              value={payload.notes}
              onChange={(event) => setPayload({ ...payload, notes: event.target.value })}
              rows={3}
            />
          </Field>

          <button
            type="submit"
            disabled={disableSubmit || isPending}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-orange-400 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isPending ? "Scoring..." : "Submit for scoring"}
          </button>
        </form>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold">Webhook preview</h2>
          <p className="text-sm text-[var(--muted)]">
            Response returned immediately; webhook fires after worker completes.
          </p>
          <div className="mt-4 rounded-2xl bg-[var(--background)] p-4 font-mono text-xs">
            <pre className="whitespace-pre-wrap">
{`{
  "job_id": "${jobId ?? "pending"}",
  "status": "${status ?? "queued"}",
  "callback": "${payload.brandId}/callbacks/brs"
}`}
            </pre>
          </div>
          {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
        </div>
      </div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <div className="mb-1 font-semibold">{label}</div>
      {children}
      {hint && <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>}
    </label>
  );
}

function UploadZone({
  onSelectFile,
  status,
  progress,
  fileName,
  error,
}: {
  onSelectFile: (file: File) => void;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  fileName: string | null;
  error: string | null;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onSelectFile(file);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "mt-2 flex flex-col gap-2 rounded-2xl border border-dashed border-[var(--border)] px-4 py-6 text-center",
        isDragging ? "border-violet-500 bg-violet-500/5" : "",
      )}
    >
      <input
        type="file"
        accept="image/*,video/*,.mp4,.mov,.pdf"
        className="hidden"
        id="asset-upload-input"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <label htmlFor="asset-upload-input" className="cursor-pointer text-sm font-medium text-violet-500">
        Drag & drop or click to upload creative
      </label>
      <p className="text-xs text-[var(--muted)]">
        Files land in MinIO/S3 via the gateway; URL auto-fills once uploaded.
      </p>
      {status === "uploading" && (
        <div className="w-full rounded-full bg-[var(--border)]">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-orange-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {fileName && (
        <p className="text-xs text-[var(--muted)]">
          {fileName} {status === "success" && "✓"}
        </p>
      )}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
