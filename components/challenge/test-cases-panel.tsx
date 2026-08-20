import { Check, XCircle } from "lucide-react";
import type { TestCase } from "@/lib/api/problems";
import type { TestResult } from "@/lib/api/submissions";

interface TestCasesPanelProps {
  testCases: TestCase[];
  results: TestResult[] | null;
  error: string | null;
}

export function TestCasesPanel({ testCases, results, error }: TestCasesPanelProps) {
  const passedCount = results?.filter((r) => r.passed).length ?? 0;

  if (error) {
    return (
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-brand-destructive/30 bg-brand-destructive/5 px-3 py-2.5">
          <XCircle className="size-4 text-brand-destructive shrink-0" />
          <p className="text-[12.5px] text-brand-destructive font-mono">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-brand-text">Test Cases</p>
        {results && (
          <span
            className={`flex items-center gap-1 text-[11px] font-medium ${
              passedCount === results.length ? "text-brand-primary" : "text-brand-destructive"
            }`}
          >
            {passedCount === results.length ? (
              <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-brand-primary">
                <Check className="size-2 text-white" strokeWidth={3} />
              </span>
            ) : (
              <XCircle className="size-3.5" />
            )}
            {passedCount} / {results.length} passed
          </span>
        )}
      </div>
      <div className="divide-y divide-brand-border">
        {testCases.map((test, i) => {
          const result = results?.[i];
          return (
            <div key={i} className="flex gap-3 py-2.5 text-[12.5px]">
              <span className="shrink-0 mt-0.5">
                {result ? (
                  result.passed ? (
                    <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-brand-primary">
                      <Check className="size-2 text-white" strokeWidth={3} />
                    </span>
                  ) : (
                    <XCircle className="size-3.5 text-brand-destructive" />
                  )
                ) : (
                  <span className="text-brand-text-subtle">&middot;</span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-brand-text">Test {i + 1}</p>
                <p className="font-mono text-brand-text-muted truncate">Input: {test.input}</p>
                <p className="font-mono text-brand-text-muted truncate">
                  Expected: {test.expected}
                </p>
                {result && (
                  <p className={`font-mono truncate ${result.passed ? "text-brand-primary" : "text-brand-destructive"}`}>
                    Got: {result.actual}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
