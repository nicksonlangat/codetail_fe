"use client";
import type { NodeProps } from "@xyflow/react";
import { Database } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function DatabaseNode({ data, selected }: NodeProps) {
  const d = data as { label?: string; subtitle?: string; badge?: string };
  return (
    <BaseNode
      selected={selected}
      icon={<Database className="h-4 w-4" />}
      label={d.label ?? "Database"}
      subtitle={d.subtitle}
      badge={d.badge}
      color="bg-orange-500/10"
      iconColor="text-orange-400"
    />
  );
}
