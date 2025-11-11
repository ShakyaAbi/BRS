import { SettingsPanel } from "@/components/brs/SettingsPanel";
import { getSettings } from "@/lib/mock";
import { getGuides } from "@/lib/guides-store";
import { getClusterMeta } from "@/lib/cluster-store";

export default async function SettingsPage() {
  const [settings, guides, clusterMeta] = await Promise.all([
    getSettings(),
    getGuides(),
    getClusterMeta(),
  ]);
  return (
    <SettingsPanel
      initialSettings={settings}
      initialGuides={guides}
      clusterMeta={clusterMeta}
    />
  );
}
