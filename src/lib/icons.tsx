import {
  Layers,
  GitBranch,
  Hash,
  Box,
  TreePine,
  Shuffle,
  Brain,
  Workflow,
  FileCode,
  Binary,
  Server,
  Globe,
  Database,
  Zap,
  Rocket,
  Shield,
  Cog,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Layers,
  GitBranch,
  Hash,
  Box,
  TreePine,
  Shuffle,
  Brain,
  Workflow,
  FileCode,
  Binary,
  Server,
  Globe,
  Database,
  Zap,
  Rocket,
  Shield,
  Cog,
  BookOpen,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Layers;
}
