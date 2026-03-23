export type ChallengeType = "code" | "mcq" | "fix-code";

export interface McqOption {
  id: string;
  label: string;
  code?: string;
}

export interface ChallengeContent {
  problemId: string;
  title: string;
  type: ChallengeType;
  description: string;
  requirements: string[];
  hints: string[];
  starterCode: string;
  exampleOutput?: string;
  options?: McqOption[];
  correctOptionId?: string;
  explanation?: string;
  issueDescription?: string;
}

export type FeedbackStatus = "idle" | "evaluating" | "pass" | "fail";

export interface FeedbackPoint {
  label: string;
  pass: boolean;
  note: string;
}

export interface Feedback {
  status: "pass" | "fail";
  score: number;
  summary: string;
  points: FeedbackPoint[];
  suggestion?: string;
}
