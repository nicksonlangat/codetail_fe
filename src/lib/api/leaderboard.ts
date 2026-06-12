import apiClient from "./client";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp_week: number;
  change: "up" | "down" | "same";
  is_you: boolean;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  your_rank: number | null;
  your_xp_week: number;
}

export async function getWeeklyLeaderboard() {
  const res = await apiClient.get<LeaderboardResponse>("/leaderboard/weekly");
  return res.data;
}
