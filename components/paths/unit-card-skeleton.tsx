export function UnitCardSkeleton() {
  return (
    <div className="border border-brand-border-strong rounded-xl bg-white p-4 animate-pulse">
      <div className="h-4 w-2/3 rounded bg-brand-surface mb-3" />
      <div className="h-3 w-full rounded bg-brand-surface mb-1.5" />
      <div className="h-3 w-1/2 rounded bg-brand-surface mb-3" />
      <div className="h-1.5 w-full rounded-full bg-brand-surface mb-1.5" />
      <div className="h-3 w-16 rounded bg-brand-surface" />
    </div>
  );
}
