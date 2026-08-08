export function PathCardSkeleton() {
  return (
    <div className="flex flex-col h-full border border-brand-border-strong rounded-xl bg-white p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="size-11 rounded-lg bg-brand-surface" />
        <div className="size-9 rounded-full bg-brand-surface" />
      </div>
      <div className="h-4 w-3/4 rounded bg-brand-surface" />
      <div className="h-3 w-full rounded bg-brand-surface mt-2.5" />
      <div className="h-3 w-2/3 rounded bg-brand-surface mt-1.5 mb-3" />
      <div className="flex gap-1.5">
        <div className="h-5 w-14 rounded-md bg-brand-surface" />
        <div className="h-5 w-16 rounded-md bg-brand-surface" />
      </div>
      <div className="h-9 mt-4 pt-4 border-t border-brand-border-strong" />
    </div>
  );
}
