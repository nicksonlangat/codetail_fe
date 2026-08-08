import { useQuery } from "@tanstack/react-query";
import { getProblem } from "@/lib/api/problems";
import { getProgress } from "@/lib/api/progress";
import { useAuthStore } from "@/stores/auth-store";
import { problemKeys, progressKeys } from "./keys";

export function useProblem(problemId: string) {
  return useQuery({
    queryKey: problemKeys.detail(problemId),
    queryFn: () => getProblem(problemId),
  });
}

// Requires a session — /progress/{id} is a strict-auth route, unlike
// /problems/{id} which allows anonymous browsing.
export function useProgress(problemId: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: progressKeys.detail(problemId),
    queryFn: () => getProgress(problemId),
    enabled: isAuthenticated,
  });
}
