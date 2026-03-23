import type { Feedback } from "@/types";

/**
 * Generates mock feedback for a code submission.
 * Pure logic -- no React dependencies.
 */
export function generateFeedback(code: string, problemId: string): Feedback {
  const stripped = code.replace(/\s/g, "").replace(/#.*/g, "").replace(/pass/g, "");
  const hasContent = stripped.length > 30;
  const hasClass = code.includes("class ") || code.includes("def ");
  const hasReturn = code.includes("return") || code.includes("yield");

  if (!hasContent) {
    return {
      status: "fail",
      score: 15,
      summary:
        "The solution is mostly empty. Try implementing the core logic before submitting.",
      points: [
        {
          label: "Code structure",
          pass: false,
          note: "No meaningful implementation found.",
        },
        {
          label: "Requirements met",
          pass: false,
          note: "None of the requirements are addressed.",
        },
      ],
      suggestion:
        "Start by reading the requirements carefully and implementing them one at a time.",
    };
  }

  const score = hasClass && hasReturn ? 85 : hasClass ? 60 : 40;
  const passed = score >= 70;

  return {
    status: passed ? "pass" : "fail",
    score,
    summary: passed
      ? "Good implementation! Your code covers the core requirements with clean structure."
      : "Partial implementation — some requirements are missing or incorrect.",
    points: [
      {
        label: "Code structure",
        pass: hasClass,
        note: hasClass
          ? "Proper class/function definition."
          : "Missing expected structure.",
      },
      {
        label: "Core logic",
        pass: hasReturn,
        note: hasReturn
          ? "Return/yield statement present."
          : "No return value — logic may be incomplete.",
      },
      {
        label: "Field types",
        pass: passed,
        note: passed
          ? "Appropriate field types used."
          : "Some field types are missing or incorrect.",
      },
      {
        label: "Best practices",
        pass: score > 75,
        note:
          score > 75
            ? "Follows Django conventions."
            : "Could follow conventions more closely.",
      },
    ],
    suggestion: passed
      ? "Consider adding docstrings and type hints for extra clarity."
      : "Review the requirements list and make sure each one is addressed in your code.",
  };
}
