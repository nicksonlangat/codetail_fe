import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { getProjects, getProject, getProjectStats } from "@/lib/api/projects";
import { projectKeys } from "./keys";
import type { ProjectMode, ProjectTier } from "@/lib/api/types";

export function useProjects(mode?: ProjectMode, tier?: ProjectTier) {
  const isAuth = !!useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: projectKeys.list(mode, tier),
    queryFn:  () => getProjects({ mode, tier }),
    enabled:  isAuth,
  });
}

export function useProject(id: string) {
  const isAuth = !!useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn:  () => getProject(id),
    enabled:  isAuth && !!id,
  });
}

export function useProjectStats() {
  const isAuth = !!useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: projectKeys.stats(),
    queryFn:  getProjectStats,
    enabled:  isAuth,
  });
}
