"use client";
import type { NodeProps } from "@xyflow/react";
import { Monitor } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function ClientNode({ data, selected }: NodeProps) {
  const d = data as { label?: string; subtitle?: string; badge?: string };
  return (
    <BaseNode
      selected={selected}
      icon={<Monitor className="h-4 w-4" />}
      label={d.label ?? "Client"}
      subtitle={d.subtitle}
      badge={d.badge}
      color="bg-sky-500/10"
      iconColor="text-sky-400"
    />
  );
}
