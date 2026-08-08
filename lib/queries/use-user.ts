import { useQuery } from "@tanstack/react-query";
import { getRank } from "@/lib/api/auth";
import { getWeeklyLeaderboard } from "@/lib/api/leaderboard";
import { useAuthStore } from "@/stores/auth-store";
import { userKeys, leaderboardKeys } from "./keys";

// Both require a signed-in user — gate on the session so a logged-out
// visitor doesn't fire a request that can only ever 401.
export function useRank() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: userKeys.rank,
    queryFn: getRank,
    enabled: isAuthenticated,
  });
}

export function useWeeklyLeaderboard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: leaderboardKeys.weekly,
    queryFn: getWeeklyLeaderboard,
    enabled: isAuthenticated,
  });
}
