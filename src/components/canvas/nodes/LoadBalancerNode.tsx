"use client";
import type { NodeProps } from "@xyflow/react";
import { GitMerge } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function LoadBalancerNode({ data, selected }: NodeProps) {
  const d = data as { label?: string; subtitle?: string; badge?: string };
  return (
    <BaseNode
      selected={selected}
      icon={<GitMerge className="h-4 w-4" />}
      label={d.label ?? "Load Balancer"}
      subtitle={d.subtitle}
      badge={d.badge}
      color="bg-green-500/10"
      iconColor="text-green-400"
    />
  );
}
