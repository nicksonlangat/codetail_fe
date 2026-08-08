import apiClient from "./client";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp_week: number;
  change: "up" | "down" | "same";
  is_you: boolean;
}

export interface WeeklyLeaderboard {
  entries: LeaderboardEntry[];
  your_rank: number | null;
  your_xp_week: number;
}

// your_rank is null when the user hasn't earned XP this week (not ranked
// yet), not an error state.
export async function getWeeklyLeaderboard() {
  const res = await apiClient.get<WeeklyLeaderboard>("/leaderboard/weekly");
  return res.data;
}
