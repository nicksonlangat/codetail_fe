import { streamText, stepCountIs, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const McqOptionSchema = z.object({
  id: z.string().describe("Short unique ID, e.g. 'a', 'b', 'c', 'd'"),
  label: z.string().describe("Option text shown to the candidate"),
  code: z.string().optional().describe("Optional code snippet if the option contains code"),
});

const TestCaseSchema = z.object({
  input: z.string().describe("JSON-serialisable function arguments, e.g. {\"nums\": [1,2,3], \"target\": 4}"),
  expected: z.string().describe("JSON-serialisable expected return value, e.g. \"[0,2]\""),
});

const ProblemSchema = z.object({
  title: z.string().describe("Clear, specific problem title"),
  type: z.enum(["write_code", "fix_code", "refactor", "mcq"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  stack: z.enum(["python", "django", "fastapi", "sql", "go"]),
  concept: z.string().describe("Short concept label, e.g. 'Dictionaries', 'QuerySets', 'Class-based views'"),
  description: z.string().describe(
    "Full problem statement in plain text. For write_code/fix_code, include function signature and constraints. For refactor, include the buggy/unclean code inline. For MCQ, include context and the question."
  ),
  starter_code: z.string().optional().describe("Starter code shown to candidate in the editor (write_code / fix_code)"),
  function_signature: z.string().optional().describe("e.g. 'def merge_dicts(a: dict, b: dict) -> dict'"),
  test_cases: z.array(TestCaseSchema).optional().describe("3–6 test cases for write_code / fix_code problems"),
  mcq_options: z.array(McqOptionSchema).optional().describe("4 options for MCQ problems"),
  correct_answer: z.string().optional().describe("Option id of the correct MCQ answer"),
  ai_rubric: z.string().optional().describe("Scoring rubric for refactor / Django / FastAPI problems"),
  hints: z.array(z.string()).optional().describe("1–3 progressive hints"),
});

const SYSTEM = `You are an expert Python and Django interview problem designer for Codetail, a developer assessment platform.

When the user asks you to create problems, call suggest_problem once for EACH problem you generate.
Stream your reasoning briefly before each tool call so the user understands what you're building.

Problem design rules:
- write_code / fix_code (Python only): include 4–6 test_cases with JSON input/expected strings. Always include starter_code and function_signature.
- refactor (Django/FastAPI): embed the problematic code IN the description. Provide a detailed ai_rubric for the reviewer.
- mcq: exactly 4 options (ids: "a","b","c","d"). correct_answer must be one of those ids. Options should be plausible — avoid obviously wrong distractors.
- description must be self-contained. Candidates see no other context.
- All problems must be genuinely hard to guess without understanding. No trivial questions.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: SYSTEM,
    messages: await convertToModelMessages(messages),
    tools: {
      suggest_problem: {
        description: "Propose a single interview problem for the employer to approve or reject.",
        inputSchema: ProblemSchema,
        execute: async (spec) => spec,
      },
    },
    stopWhen: stepCountIs(12),
  });

  return result.toUIMessageStreamResponse();
}
