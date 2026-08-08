// Mirrors app/domain/value_objects.py in the backend. Keep in sync.

export type Stack = "python" | "django" | "fastapi" | "sql" | "go";

// Path.difficulty — distinct from a problem's difficulty below.
export type PathDifficulty = "beginner" | "intermediate" | "advanced";

// Problem.difficulty — distinct from a path's difficulty above.
export type ProblemDifficulty = "easy" | "medium" | "hard";

export type ProblemType = "write_code" | "mcq" | "fix_code" | "refactor";

export type ProblemStatus = "not_started" | "attempted" | "solved";
