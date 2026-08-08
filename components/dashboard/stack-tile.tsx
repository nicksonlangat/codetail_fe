const LABELS: Record<string, string> = {
  python: "Py",
  django: "Dj",
  fastapi: "Fa",
  sql: "SQL",
  go: "Go",
};

export function StackTile({ stack, className = "" }: { stack: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary font-mono font-bold text-[9px] uppercase ${className}`}
    >
      {LABELS[stack] ?? stack.slice(0, 2)}
    </span>
  );
}
