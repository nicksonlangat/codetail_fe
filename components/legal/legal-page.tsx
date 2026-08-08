import type { ReactNode } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Topbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 pt-32 pb-20 w-full">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text mb-2">{title}</h1>
        <p className="text-sm text-brand-text-muted mb-8">Last updated: {lastUpdated}</p>
        <div className="space-y-6 text-[14px] leading-relaxed text-brand-text-muted">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
