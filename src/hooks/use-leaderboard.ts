import { useQuery } from "@tanstack/react-query";
import { getWeeklyLeaderboard } from "@/lib/api/leaderboard";

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard", "weekly"],
    queryFn: getWeeklyLeaderboard,
    staleTime: 60_000,
  });
}
