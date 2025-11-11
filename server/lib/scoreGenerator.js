function randomScore(min = 0, max = 1) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function buildAlerts(scores) {
  const alerts = [];
  if (scores.authenticity < 0.35) {
    alerts.push({ type: "authenticity", message: "Authenticity warning – uncanny patterns detected." });
  }
  if (scores.ip_risk > 0.6) {
    alerts.push({ type: "ip", message: "Potential restricted element detected." });
  }
  if (scores.tone < 0.5) {
    alerts.push({ type: "tone", message: "Tone drifts from signature cluster." });
  }
  if (!alerts.length) {
    alerts.push({ type: "inclusive", message: "No critical issues. Continue monitoring." });
  }
  return alerts;
}

function buildEdits() {
  return [
    { message: "Tighten copy to emphasize benefits over hype.", severity: "medium" },
    { message: "Swap skyline reference for an approved landmark.", severity: "high" },
    { message: "Add inclusive CTA referencing creators globally.", severity: "low" },
  ];
}

function buildAlternates(type) {
  return [
    {
      type: "text",
      suggestion: "A calmer, benefit-first headline tuned for APAC reviewers.",
    },
    {
      type: type === "image" ? "image" : "text",
      suggestion: "Variant focusing on authenticity cues instead of skyline imagery.",
    },
  ];
}

function buildEvidence() {
  return [
    { thumbnail: "/mock/crops/hand.svg", label: "Hand artifact" },
    { thumbnail: "/mock/crops/logo.svg", label: "Logo overlap" },
  ];
}

function generateScorecard(job) {
  const { payload } = job;
  const scores = {
    tone: randomScore(0.4, 0.95),
    ip_risk: randomScore(0.05, 0.8),
    inclusivity: randomScore(0.5, 0.95),
    lift: randomScore(-0.2, 0.5),
    authenticity: randomScore(0.2, 0.9),
  };

  return {
    id: job.asset_id,
    title: payload.title || `Asset ${job.asset_id}`,
    preview: {
      type: payload.type || "image",
      src: payload.uri || "/mock/assets/asset-123.svg",
      alt: payload.title || "Uploaded asset preview",
    },
    scores,
    alerts: buildAlerts(scores),
    edits: buildEdits(),
    alternates: buildAlternates(payload.type || "image"),
    evidence: buildEvidence(),
    metadata: {
      brand: payload.brand_id || "Pixel Riot",
      market: payload.metadata?.market || "NA",
      type: payload.type || "image",
      owner: payload.metadata?.owner || payload.metadata?.submitted_by || "Automation",
      created_at: job.created_at,
    },
  };
}

module.exports = {
  generateScorecard,
};
