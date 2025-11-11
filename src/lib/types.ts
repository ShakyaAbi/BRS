export type Pillar = "tone" | "ip_risk" | "inclusivity" | "lift" | "authenticity";

export type PillarScores = Record<Pillar, number>;

export type AlertType = "authenticity" | "ip" | "tone" | "inclusive";

export type Severity = "low" | "medium" | "high";

export type PillarTrend = "up" | "down" | null;

export type PillarLabel = "Tone Fidelity" | "IP Risk" | "Inclusivity" | "Predicted Lift" | "Authenticity";

export type Alert = {
  type: AlertType;
  message: string;
};

export type Edit = {
  message: string;
  severity: Severity;
};

export type Alternate = {
  type: "text" | "image";
  suggestion: string;
};

export type Evidence = {
  thumbnail: string;
  label: string;
};

export type Preview = {
  type: "text" | "image" | "video";
  src: string;
  alt: string;
};

export type Scorecard = {
  id: string;
  title: string;
  preview: Preview;
  scores: PillarScores;
  alerts: Alert[];
  edits: Edit[];
  alternates: Alternate[];
  evidence: Evidence[];
  metadata: {
    brand: string;
    market: "APAC" | "EMEA" | "NA";
    type: Preview["type"];
    owner: string;
    created_at: string;
  };
};

export type DashboardGauge = {
  label: PillarLabel;
  value: number;
  trend: PillarTrend;
};

export type RecentAsset = {
  id: string;
  name: string;
  brand: string;
  type: Preview["type"];
  status: "ready" | "flagged" | "review";
  score: number;
  updated_at: string;
};

export type DashboardSummary = {
  gauges: DashboardGauge[];
  alerts: Alert[];
  recentAssets: RecentAsset[];
  updated_at: string;
};

export type HistoryRow = {
  id: string;
  brand: string;
  type: Preview["type"];
  status: RecentAsset["status"];
  score: number;
  created_at: string;
};

export type AuditEntry = {
  id: string;
  asset_id: string;
  model_version: string;
  decision: "flagged" | "ready" | "requires_review";
  owner: string;
  timestamp: string;
  notes: string;
  evidence: { label: string; url: string }[];
};

export type SettingsData = {
  weights: PillarScores;
  allow_list: string[];
  deny_list: string[];
  notifications: {
    slack: boolean;
    email: boolean;
    webhook_url?: string;
  };
};

export type SubmitPayload = {
  assetUrl: string;
  brandId: string;
  type: Preview["type"];
  audience: string;
  notes?: string;
};

export type Guide = {
  id: string;
  brandId: string;
  originalName: string;
  filename: string;
  url: string;
  size: number;
  uploaded_at: string;
};

export type ClusterMeta = {
  lastRebuiltAt: string | null;
  activeBrands: string[];
};
