"use client";
import type { NodeProps } from "@xyflow/react";
import { ListOrdered } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function QueueNode({ data, selected }: NodeProps) {
  const d = data as { label?: string; subtitle?: string; badge?: string };
  return (
    <BaseNode
      selected={selected}
      icon={<ListOrdered className="h-4 w-4" />}
      label={d.label ?? "Queue"}
      subtitle={d.subtitle}
      badge={d.badge}
      color="bg-purple-500/10"
      iconColor="text-purple-400"
    />
  );
}
