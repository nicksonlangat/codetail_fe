"use client";

import { Check, XCircle } from "lucide-react";
import type { SqlRunResult } from "@/lib/api/submissions";

interface SqlResultsPanelProps {
  result: SqlRunResult | null;
  error: string | null;
  isLoading?: boolean;
}

const SHIMMER_COLS = 3;
const SHIMMER_ROWS = 5;
const COL_WIDTHS = ["w-16", "w-24", "w-14"];

function TableSkeleton() {
  return (
    <div className="px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="h-3.5 w-14 rounded bg-brand-surface animate-pulse" />
        <div className="h-3 w-16 rounded bg-brand-surface animate-pulse" />
      </div>
      <div className="rounded-lg border border-brand-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface">
              {Array.from({ length: SHIMMER_COLS }).map((_, i) => (
                <th key={i} className="px-3 py-2.5">
                  <div className={`h-2.5 rounded bg-brand-border animate-pulse ${COL_WIDTHS[i]}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {Array.from({ length: SHIMMER_ROWS }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: SHIMMER_COLS }).map((_, c) => (
                  <td key={c} className="px-3 py-2.5">
                    <div
                      className={`h-2.5 rounded bg-brand-surface animate-pulse ${
                        c === 0 ? "w-20" : c === 1 ? "w-28" : "w-12"
                      }`}
                      style={{ animationDelay: `${(r * SHIMMER_COLS + c) * 40}ms` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SqlResultsPanel({ result, error, isLoading }: SqlResultsPanelProps) {
  if (isLoading) return <TableSkeleton />;

  const displayError = error ?? result?.error ?? null;

  if (displayError) {
    return (
      <div className="px-4 py-3">
        <div className="flex items-start gap-2 rounded-lg border border-brand-destructive/30 bg-brand-destructive/5 px-3 py-2.5">
          <XCircle className="size-4 text-brand-destructive shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-brand-destructive font-mono">{displayError}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-sm text-brand-text-muted">Run your query to see results.</p>
      </div>
    );
  }

  if (result.columns.length === 0) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-sm text-brand-text-muted">Query returned no rows.</p>
      </div>
    );
  }

  const showExpected = !result.passed && result.expected_columns.length > 0;

  return (
    <div className="px-4 py-3 flex flex-col gap-3">
      {result.columns.length > 0 && (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] font-medium ${
          result.passed
            ? "bg-brand-success/8 border border-brand-success/20 text-brand-success"
            : "bg-brand-destructive/5 border border-brand-destructive/20 text-brand-destructive"
        }`}>
          {result.passed ? (
            <span className="inline-flex items-center justify-center size-4 rounded-full bg-brand-success shrink-0">
              <Check className="size-2.5 text-white" strokeWidth={3} />
            </span>
          ) : (
            <XCircle className="size-4 shrink-0" />
          )}
          {result.passed ? "Correct" : "Incorrect. Your output does not match the expected result."}
        </div>
      )}

      <ResultTable
        label="Your output"
        columns={result.columns}
        rows={result.rows}
        rowCount={result.row_count}
        truncated={result.truncated}
      />

      {showExpected && (
        <ResultTable
          label="Expected (first 10 rows)"
          columns={result.expected_columns}
          rows={result.expected_rows}
        />
      )}
    </div>
  );
}

function ResultTable({
  label,
  columns,
  rows,
  rowCount,
  truncated,
}: {
  label: string;
  columns: string[];
  rows: (string | number | boolean | null)[][];
  rowCount?: number;
  truncated?: boolean;
}) {
  if (columns.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wide">{label}</p>
        {rowCount !== undefined && (
          <span className="text-[11px] text-brand-text-muted">
            {rowCount} {rowCount === 1 ? "row" : "rows"}
            {truncated && " · truncated at 500"}
          </span>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-brand-border">
        <table className="w-full text-[12px] font-mono">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface">
              {columns.map((col) => (
                <th key={col} className="px-3 py-2 text-left text-[11px] font-semibold text-brand-text-muted uppercase tracking-wide whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-brand-surface/50 transition-colors duration-150">
                {row.map((cell, j) => (
                  <td key={j} className={`px-3 py-2 whitespace-nowrap ${cell === null ? "text-brand-text-subtle italic" : "text-brand-text"}`}>
                    {cell === null ? "NULL" : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
