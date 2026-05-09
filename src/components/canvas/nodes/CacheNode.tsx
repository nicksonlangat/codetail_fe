"use client";
import type { NodeProps } from "@xyflow/react";
import { Zap } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function CacheNode({ data, selected }: NodeProps) {
  const d = data as { label?: string; subtitle?: string; badge?: string };
  return (
    <BaseNode
      selected={selected}
      icon={<Zap className="h-4 w-4" />}
      label={d.label ?? "Cache"}
      subtitle={d.subtitle}
      badge={d.badge}
      color="bg-red-500/10"
      iconColor="text-red-400"
    />
  );
}
