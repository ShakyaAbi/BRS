"use client";

import axios from "axios";
import { useMemo, useState, useTransition } from "react";
import type { ClusterMeta, Guide, SettingsData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface Props {
  initialSettings: SettingsData;
  initialGuides: Guide[];
  clusterMeta: ClusterMeta;
}

const BRANDS = [
  { id: "pixel-riot", label: "Pixel Riot" },
  { id: "glow-collective", label: "Glow Collective" },
  { id: "acme-studios", label: "Acme Studios" },
];

export function SettingsPanel({ initialSettings, initialGuides, clusterMeta }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [baseline, setBaseline] = useState(initialSettings);
  const [allowList, setAllowList] = useState(initialSettings.allow_list.join("\n"));
  const [denyList, setDenyList] = useState(initialSettings.deny_list.join("\n"));
  const [guides, setGuides] = useState(initialGuides);
  const [guideBrand, setGuideBrand] = useState(BRANDS[0].id);
  const [guideProgress, setGuideProgress] = useState(0);
  const [guideStatus, setGuideStatus] = useState<"idle" | "uploading" | "error" | "success">("idle");
  const [guideError, setGuideError] = useState<string | null>(null);
  const [clusterInfo, setClusterInfo] = useState(clusterMeta);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(clusterMeta.activeBrands ?? []);
  const [clusterMessage, setClusterMessage] = useState<string | null>(null);
  const [clusterBusy, setClusterBusy] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const weightTotal = useMemo(
    () => Object.values(settings.weights).reduce((sum, value) => sum + value, 0),
    [settings.weights],
  );

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(baseline),
    [settings, baseline],
  );

  const saveSettings = () => {
    startTransition(async () => {
      setSaveMessage(null);
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        setSaveMessage("Save failed. Check logs.");
        return;
      }
      setBaseline(settings);
      setSaveMessage("Settings saved to Postgres replica.");
    });
  };

  const handleGuideUpload = async (file: File) => {
    setGuideStatus("uploading");
    setGuideProgress(0);
    setGuideError(null);
    const data = new FormData();
    data.append("file", file);
    data.append("brandId", guideBrand);
    try {
      const response = await axios.post("/api/guides", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!event.total) return;
          setGuideProgress(Math.round((event.loaded / event.total) * 100));
        },
      });
      const guide = response.data as Guide;
      setGuides((prev) => [guide, ...prev]);
      setGuideStatus("success");
    } catch (error) {
      console.error(error);
      setGuideStatus("error");
      setGuideError("Upload failed. Try a smaller PDF/Markdown file.");
    }
  };

  const rebuildClusters = async () => {
    setClusterBusy(true);
    setClusterMessage(null);
    try {
      const response = await fetch("/api/clusters/rebuild", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandIds: selectedBrands }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to rebuild");
      }
      setClusterInfo({
        lastRebuiltAt: data.rebuiltAt,
        activeBrands: data.activeBrands ?? [],
      });
      setClusterMessage(`Clusters rebuilt at ${formatDate(data.rebuiltAt)}`);
    } catch (error) {
      console.error(error);
      setClusterMessage("Rebuild failed. Worker logs have detail.");
    } finally {
      setClusterBusy(false);
    }
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId],
    );
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Settings</p>
          <h1 className="text-2xl font-semibold">Signal weighting & guardrails</h1>
          <p className="text-sm text-[var(--muted)]">
            Adjust brand-level pillar weights, manage allow / deny rules, upload guides, and nudge
            pgvector clusters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={saveSettings}
            disabled={!isDirty || isPending}
            className="rounded-2xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {isPending ? "Saving..." : "Save settings"}
          </button>
          {saveMessage && <p className="text-xs text-[var(--muted)]">{saveMessage}</p>}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold">Pillar weights</h2>
          <p className="text-sm text-[var(--muted)]">Sum should equal 1.0</p>
          <div className="space-y-4">
            {Object.entries(settings.weights).map(([pillar, value]) => (
              <label key={pillar} className="block text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold capitalize">{pillar.replace("_", " ")}</span>
                  <span>{value.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={value}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      weights: { ...prev.weights, [pillar]: Number(event.target.value) },
                    }))
                  }
                  className="mt-2 w-full"
                />
              </label>
            ))}
          </div>
          <p className="text-sm font-semibold">Total weight: {weightTotal.toFixed(2)}</p>
        </div>

        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-[var(--muted)]">Toggle Slack / Email streaming</p>
          <div className="space-y-3">
            <ToggleRow
              label="Slack alerts"
              enabled={settings.notifications.slack}
              onToggle={(enabled) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, slack: enabled },
                }))
              }
            />
            <ToggleRow
              label="Email digests"
              enabled={settings.notifications.email}
              onToggle={(enabled) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: enabled },
                }))
              }
            />
            <label className="block text-sm">
              <span className="font-semibold">Webhook URL</span>
              <input
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-transparent px-3 py-2"
                value={settings.notifications.webhook_url}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, webhook_url: event.target.value },
                  }))
                }
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <JsonCard
          label="Allow list"
          value={allowList}
          onChange={(text) => {
            setAllowList(text);
            setSettings((prev) => ({ ...prev, allow_list: text.split("\n").filter(Boolean) }));
          }}
        />
        <JsonCard
          label="Deny list"
          value={denyList}
          onChange={(text) => {
            setDenyList(text);
            setSettings((prev) => ({ ...prev, deny_list: text.split("\n").filter(Boolean) }));
          }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Brand guides</h2>
            <select
              className="rounded-2xl border border-[var(--border)] bg-transparent px-3 py-1 text-sm"
              value={guideBrand}
              onChange={(event) => setGuideBrand(event.target.value)}
            >
              {BRANDS.map((brand) => (
                <option key={brand.id} value={brand.id} className="text-black">
                  {brand.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-[var(--muted)]">
            Upload PDF/Markdown guides to hydrate embeddings + guardrails.
          </p>
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (event.dataTransfer.files?.[0]) {
                handleGuideUpload(event.dataTransfer.files[0]);
              }
            }}
            className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-6 text-center"
          >
            <label className="cursor-pointer text-sm font-semibold text-violet-500">
              Drag/drop or click to upload
              <input
                type="file"
                accept=".pdf,.md,.txt"
                className="hidden"
                onChange={(event) => {
                  if (event.target.files?.[0]) {
                    handleGuideUpload(event.target.files[0]);
                  }
                }}
              />
            </label>
            {guideStatus === "uploading" && (
              <div className="mt-3 w-full rounded-full bg-[var(--border)]">
                <div
                  className="h-2 rounded-full bg-violet-500 transition-all"
                  style={{ width: `${guideProgress}%` }}
                />
              </div>
            )}
            {guideStatus === "success" && (
              <p className="mt-2 text-xs text-emerald-500">Guide uploaded.</p>
            )}
            {guideError && <p className="mt-2 text-xs text-rose-500">{guideError}</p>}
          </div>

          <ul className="space-y-2">
            {guides.map((guide) => (
              <li
                key={guide.id}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{guide.originalName}</span>
                  <span className="text-xs text-[var(--muted)]">
                    {formatDate(guide.uploaded_at)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                  <span>{guide.brandId}</span>
                  <a className="text-violet-500" href={guide.url} target="_blank">
                    View file
                  </a>
                </div>
              </li>
            ))}
            {!guides.length && (
              <li className="rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-center text-xs text-[var(--muted)]">
                No guides uploaded yet.
              </li>
            )}
          </ul>
        </div>

        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold">Signature clusters</h2>
          <p className="text-sm text-[var(--muted)]">
            Trigger pgvector centroid rebuilds after guide uploads or asset backfills.
          </p>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => toggleBrand(brand.id)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  selectedBrands.includes(brand.id)
                    ? "border-violet-500 bg-violet-500/10 text-violet-500"
                    : "border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                {brand.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={rebuildClusters}
            disabled={clusterBusy}
            className="rounded-2xl bg-gradient-to-r from-violet-500 to-orange-400 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {clusterBusy ? "Rebuilding..." : "Rebuild signature clusters"}
          </button>
          <div className="text-xs text-[var(--muted)]">
            <p>
              Last rebuild:{" "}
              {clusterInfo.lastRebuiltAt ? formatDate(clusterInfo.lastRebuiltAt) : "never"}
            </p>
            <p>Active brands: {clusterInfo.activeBrands?.join(", ") || "none"}</p>
            {clusterMessage && <p className="text-emerald-500">{clusterMessage}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function ToggleRow({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onToggle(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          enabled ? "bg-violet-500" : "bg-[var(--border)]"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}

function JsonCard({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
}) {
  return (
    <div className="space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="text-lg font-semibold">{label}</h2>
      <textarea
        className="h-48 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
