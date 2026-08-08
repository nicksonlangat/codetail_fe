// Centralized query keys. Import these instead of writing raw key arrays
// in components, so a key never has to be typed the same way twice.

export const pathKeys = {
  all: ["paths"] as const,
  list: (stack?: string) => [...pathKeys.all, "list", stack ?? "all"] as const,
  detail: (slug: string) => [...pathKeys.all, "detail", slug] as const,
  units: (slug: string) => [...pathKeys.all, "units", slug] as const,
  problems: (slug: string, unit?: string) =>
    [...pathKeys.all, "problems", slug, unit ?? "all"] as const,
};

export const progressKeys = {
  dashboard: ["progress", "dashboard"] as const,
  detail: (problemId: string) => ["progress", "detail", problemId] as const,
};

export const problemKeys = {
  detail: (problemId: string) => ["problems", "detail", problemId] as const,
};

export const userKeys = {
  rank: ["user", "rank"] as const,
};

export const leaderboardKeys = {
  weekly: ["leaderboard", "weekly"] as const,
};
