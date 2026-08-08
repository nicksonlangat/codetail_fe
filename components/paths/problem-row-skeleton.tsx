export function ProblemRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border border-brand-border-strong rounded-lg bg-white animate-pulse">
      <div className="h-5 w-7 rounded bg-brand-surface shrink-0" />
      <div className="size-8 rounded-lg bg-brand-surface shrink-0" />
      <div className="flex-1">
        <div className="h-3.5 w-1/2 rounded bg-brand-surface mb-2" />
        <div className="h-3 w-1/3 rounded bg-brand-surface" />
      </div>
    </div>
  );
}
