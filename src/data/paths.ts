import type { LearningPath } from "@/types";
import { dsaPaths } from "./paths-dsa";
import { dsaAdvancedPaths } from "./paths-dsa-advanced";
import { frameworksPaths } from "./paths-frameworks";

export const paths: LearningPath[] = [
  ...dsaPaths,
  ...dsaAdvancedPaths,
  ...frameworksPaths,
];

export function getPathById(pathId: string): LearningPath | undefined {
  return paths.find((p) => p.id === pathId);
}

export function getPathsByCategory(category: "dsa" | "frameworks"): LearningPath[] {
  return paths.filter((p) => p.category === category);
}

export function getProblemById(pathId: string, problemId: string) {
  const path = getPathById(pathId);
  return path?.problems.find((p) => p.id === problemId);
}
