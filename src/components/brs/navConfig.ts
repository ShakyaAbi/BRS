import {
  Activity,
  AlertTriangle,
  BookOpenCheck,
  GaugeCircle,
  History,
  LayoutDashboard,
  Settings,
  ShieldAlert,
} from "lucide-react";

export const NAV_LINKS = [
  { href: "/brs/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/brs/asset/asset-123", label: "Asset Detail", icon: Activity },
  { href: "/brs/submit", label: "Submit", icon: GaugeCircle },
  { href: "/brs/history", label: "History", icon: History },
  { href: "/brs/settings", label: "Settings", icon: Settings },
  { href: "/brs/audits", label: "Audits", icon: ShieldAlert },
];

export const ALERT_ICONS = {
  authenticity: AlertTriangle,
  ip: ShieldAlert,
  tone: BookOpenCheck,
  inclusive: BookOpenCheck,
};
