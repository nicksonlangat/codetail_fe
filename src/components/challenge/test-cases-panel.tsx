"use client";

import { CheckCircle2, XCircle, Minus } from "lucide-react";
import type { ChallengeExample } from "@/types";

export interface TestCaseResult {
  input: string;
  expected: string;
  actual: string | null;
  passed: boolean | null; // null = not run yet
}

interface TestCasesPanelProps {
  examples: ChallengeExample[];
  results: TestCaseResult[];
  running: boolean;
}

export function TestCasesPanel({ examples, results, running }: TestCasesPanelProps) {
  const hasResults = results.length > 0;
  const passed = results.filter((r) => r.passed === true).length;
  const total = hasResults ? results.length : examples.length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-border/40 bg-card/50 flex-shrink-0">
        <span className="text-[12px] font-medium">Test Cases</span>
        {hasResults && (
          <span className={`text-[11px] font-mono tabular-nums ${passed === total ? "text-green-500" : "text-muted-foreground"}`}>
            {passed}/{total} passing
          </span>
        )}
        {running && (
          <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span className="w-3 h-3 border-[1.5px] border-primary border-t-transparent rounded-full animate-spin" />
            Running...
          </span>
        )}
      </div>

      {/* Test cases */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {(hasResults ? results : examples.map((ex) => ({
          input: ex.input,
          expected: ex.output,
          actual: null,
          passed: null,
        }))).map((tc, i) => (
          <div key={i} className="space-y-1 pb-3 border-b border-border/30 last:border-0">
            <div className="flex items-center gap-1.5 mb-1">
              {tc.passed === true && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
              {tc.passed === false && <XCircle className="w-3.5 h-3.5 text-red-500" />}
              {tc.passed === null && <Minus className="w-3.5 h-3.5 text-muted-foreground/30" />}
              <span className="text-[11px] font-medium text-muted-foreground">
                Test {i + 1}
              </span>
            </div>
            <div className="text-[12px] font-mono space-y-0.5 pl-5">
              <p>
                <span className="text-muted-foreground">Input: </span>
                <span className="text-foreground">{tc.input}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Expected: </span>
                <span className="text-foreground">{tc.expected}</span>
              </p>
              {tc.actual !== null && (
                <p>
                  <span className="text-muted-foreground">Output: </span>
                  <span className={tc.passed ? "text-green-500" : "text-red-500"}>
                    {tc.actual} {tc.passed ? "✓" : "✗"}
                  </span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
