import { AppTopbar } from "@/components/dashboard/app-topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-bg min-h-screen flex flex-col items-center text-brand-text font-sans">
      <AppTopbar />
      {children}
    </div>
  );
}
