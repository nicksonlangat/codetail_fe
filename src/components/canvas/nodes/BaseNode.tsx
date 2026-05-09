"use client";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

const H =
  "!w-2.5 !h-2.5 !rounded-full !border-2 !border-[#1fad87] !bg-background hover:!bg-[#1fad87]/40 transition-colors duration-150 cursor-crosshair";

interface BaseNodeProps {
  selected?: boolean;
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  color: string;
  iconColor: string;
  badge?: string;
}

export function BaseNode({ selected, icon, label, subtitle, color, iconColor, badge }: BaseNodeProps) {
  return (
    <div
      className={cn(
        "relative min-w-[130px] rounded-xl border bg-card px-3 py-2.5 shadow-sm select-none",
        selected ? "border-[#1fad87] shadow-[0_0_0_2px_#1fad8730]" : "border-border"
      )}
    >
      {/* 4 handles — source on all sides so any direction works */}
      <Handle type="source" position={Position.Top}    id="t" className={H} />
      <Handle type="source" position={Position.Right}  id="r" className={H} />
      <Handle type="source" position={Position.Bottom} id="b" className={H} />
      <Handle type="source" position={Position.Left}   id="l" className={H} />

      <div className="flex items-center gap-2">
        <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", color)}>
          <span className={cn("h-4 w-4", iconColor)}>{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold leading-tight truncate">{label}</p>
          {subtitle && <p className="text-[9px] text-muted-foreground truncate">{subtitle}</p>}
        </div>
        {badge && (
          <span className="ml-auto shrink-0 rounded-full bg-[#1fad87]/10 px-1.5 py-0.5 text-[9px] font-mono text-[#1fad87]">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
