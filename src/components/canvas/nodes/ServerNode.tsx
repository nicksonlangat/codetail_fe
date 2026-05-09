"use client";
import type { NodeProps } from "@xyflow/react";
import { Server } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function ServerNode({ data, selected }: NodeProps) {
  const d = data as { label?: string; subtitle?: string; badge?: string };
  return (
    <BaseNode
      selected={selected}
      icon={<Server className="h-4 w-4" />}
      label={d.label ?? "Server"}
      subtitle={d.subtitle}
      badge={d.badge}
      color="bg-blue-500/10"
      iconColor="text-blue-400"
    />
  );
}
