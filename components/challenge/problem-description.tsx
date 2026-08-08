import { Zap } from "lucide-react";
import { PROBLEM_DIFFICULTY_PILL, PROBLEM_DIFFICULTY_XP, PROBLEM_TYPE_CONFIG } from "@/components/paths/constants";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";
import { PROSE_CLASS } from "./prose-styles";
import type { ProblemDetail } from "@/lib/api/problems";

const KW = "text-brand-primary";

export function ProblemDescription({ problem }: { problem: ProblemDetail }) {
  const type = PROBLEM_TYPE_CONFIG[problem.type];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold text-brand-text">{problem.title}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span
            className={`rounded-md text-[11px] font-medium px-2 py-0.5 capitalize ${PROBLEM_DIFFICULTY_PILL[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-brand-surface text-brand-text-muted text-[11px] font-medium px-2 py-0.5">
            <type.icon className="size-3" />
            {type.label}
          </span>
          {problem.concept && (
            <span className="rounded-md bg-brand-surface text-brand-text-muted text-[11px] font-medium px-2 py-0.5">
              {problem.concept}
            </span>
          )}
          <span className="flex items-center gap-1 rounded-md bg-brand-warning/10 text-brand-warning text-[11px] font-medium px-2 py-0.5">
            <Zap className="size-3" fill="currentColor" />
            +{PROBLEM_DIFFICULTY_XP[problem.difficulty]} XP
          </span>
        </div>
      </div>

      <hr className="border-brand-border" />

      {problem.type === "fix_code" && problem.issue_description && (
        <div>
          <h4 className="text-sm font-semibold text-brand-text mb-1.5">What&apos;s broken</h4>
          <p className="text-[13px] leading-6 text-brand-text-muted whitespace-pre-wrap">
            {problem.issue_description}
          </p>
        </div>
      )}

      {/* The HTML itself carries its own headings (e.g. Scenario,
          Constraints — see app/seed_data/*.py), so no extra label wraps it */}
      <TipTapRenderer content={problem.description} className={PROSE_CLASS} />

      {problem.function_signature && (
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-brand-text-subtle mb-1.5">
            Function signature
          </p>
          <div className="rounded-lg bg-brand-surface px-4 py-2.5 font-mono text-[12.5px] text-brand-text overflow-x-auto">
            <span className={KW}>def</span> {problem.function_signature}
          </div>
        </div>
      )}

      {problem.examples.map((ex, i) => (
        <div key={i} className="rounded-xl border border-brand-border-strong p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-brand-text-subtle mb-1.5">
            Example {i + 1}
          </p>
          <p className="font-mono text-[12.5px] text-brand-text">Input: {ex.input}</p>
          <p className="font-mono text-[12.5px] text-brand-text">Output: {ex.output}</p>
          {ex.explanation && (
            <p className="mt-1.5 text-[12px] text-brand-text-muted">{ex.explanation}</p>
          )}
        </div>
      ))}
    </div>
  );
}
