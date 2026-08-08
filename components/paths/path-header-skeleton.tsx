export function PathHeaderSkeleton() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6 border border-brand-border-strong rounded-xl bg-white p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="size-14 rounded-xl bg-brand-surface shrink-0" />
        <div>
          <div className="h-5 w-48 rounded bg-brand-surface mb-2.5" />
          <div className="h-3 w-64 rounded bg-brand-surface mb-1.5" />
          <div className="h-3 w-40 rounded bg-brand-surface" />
        </div>
      </div>
      <div className="size-16 rounded-full bg-brand-surface shrink-0" />
    </div>
  );
}
