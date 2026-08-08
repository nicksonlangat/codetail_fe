// Mirrors the 9 badge IDs evaluate_badges() in backend/app/services/rewards.py
// can actually award (_EVALUABLE_BADGES). Labels/descriptions ported from
// frontend/src/components/dashboard/badges-card.tsx for consistency with the
// old app. Badges outside this set (e.g. "night-owl") exist as concepts but
// aren't wired up server-side yet, so they're intentionally omitted here.
export interface BadgeDef {
  label: string;
  description: string;
}

export const BADGE_DEFS: Record<string, BadgeDef> = {
  "first-blood": { label: "First Blood", description: "Solved your first problem" },
  "week-warrior": { label: "Week Warrior", description: "Maintained a 7-day streak" },
  debugger: { label: "Debugger", description: "Fixed 5 broken code problems" },
  "unit-clear": { label: "Unit Clear", description: "Completed a full unit" },
  pythonista: { label: "Pythonista", description: "Completed the Python path" },
  "django-dev": { label: "Django Dev", description: "Completed the Django path" },
  "path-blazer": { label: "Path Blazer", description: "Completed a full learning path" },
  "the-50": { label: "The 50", description: "Solved 50 total problems" },
  "hard-mode": { label: "Hard Mode", description: "Solved 5 hard-difficulty problems" },
};

export function badgeLabel(id: string): string {
  return BADGE_DEFS[id]?.label ?? id;
}
