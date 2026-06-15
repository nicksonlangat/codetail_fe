import { Sidebar } from "@/components/layout/sidebar";

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background p-2 gap-2">
      <Sidebar />
      <div className="flex-1 overflow-hidden rounded-xl">
        {children}
      </div>
    </div>
  );
}
