import type { LucideIcon } from "lucide-react";

interface SectionDividerProps {
  icon?: LucideIcon;
  label: string;
  count: number;
  accent?: "default" | "warning";
  // Tailwind margin-top class. Explicit per call site rather than a
  // `first:` pseudo-class trick — "first" only describes DOM position
  // within whatever wrapper a caller happens to use, not "is this
  // visually the first section on the page."
  marginTop?: string;
}

export function SectionDivider({
  icon: Icon,
  label,
  count,
  accent = "default",
  marginTop = "mt-5",
}: SectionDividerProps) {
  const textClass = accent === "warning" ? "text-brand-warning" : "text-brand-text-subtle";
  const lineClass = accent === "warning" ? "bg-brand-warning/25" : "bg-brand-border-strong";

  return (
    <div className={`flex items-center gap-2 mb-2.5 ${marginTop}`}>
      {Icon && <Icon className={`size-3 ${textClass}`} />}
      <span className={`text-[10px] font-semibold uppercase tracking-wider ${textClass}`}>
        {label}
      </span>
      <span className="text-[10px] font-mono text-brand-text-subtle">{count}</span>
      <div className={`flex-1 h-px ${lineClass}`} />
    </div>
  );
}
