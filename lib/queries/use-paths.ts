import { useQuery } from "@tanstack/react-query";
import { getPath, getPaths, getPathProblems, getPathUnits } from "@/lib/api/paths";
import { getDashboard } from "@/lib/api/progress";
import { useAuthStore } from "@/stores/auth-store";
import { pathKeys, progressKeys } from "./keys";
import type { Stack } from "@/lib/api/types";

export function usePaths(stack?: Stack) {
  return useQuery({
    queryKey: pathKeys.list(stack),
    queryFn: () => getPaths(stack),
  });
}

export function usePath(slug: string) {
  return useQuery({
    queryKey: pathKeys.detail(slug),
    queryFn: () => getPath(slug),
  });
}

export function usePathUnits(slug: string) {
  return useQuery({
    queryKey: pathKeys.units(slug),
    queryFn: () => getPathUnits(slug),
  });
}

export function usePathProblems(slug: string, unit?: string) {
  return useQuery({
    queryKey: pathKeys.problems(slug, unit),
    queryFn: () => getPathProblems(slug, unit),
  });
}

// /progress/dashboard/me requires a signed-in user, unlike /paths — only
// fire this once we actually have a session, not on every visitor.
export function useDashboard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: progressKeys.dashboard,
    queryFn: getDashboard,
    enabled: isAuthenticated,
  });
}
