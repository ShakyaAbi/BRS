import type { ReactNode } from "react";
import { Sidebar } from "@/components/brs/Sidebar";
import { TopNav } from "@/components/brs/TopNav";

export default function BrsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="brs-shell flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopNav />
        <main id="main" className="flex-1 space-y-6 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
