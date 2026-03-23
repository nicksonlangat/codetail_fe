export type ProblemStatus = "completed" | "current" | "locked";
export type PathCategory = "dsa" | "frameworks";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type PathDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface PathProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  status: ProblemStatus;
  timeEstimate: string;
  concept: string;
}

export interface LearningPath {
  id: string;
  title: string;
  icon: string;
  description: string;
  difficulty: PathDifficulty;
  topics: string[];
  unlocked: boolean;
  category: PathCategory;
  problems: PathProblem[];
}
