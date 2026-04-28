const LATENCIES = [
  { level: "CPU L1 cache", latency: "~0.5 ns", barPct: 0, tier: "extreme", note: "On-chip, per-core" },
  { level: "CPU L2 cache", latency: "~4 ns", barPct: 11, tier: "extreme", note: "On-die, slightly larger" },
  { level: "CPU L3 cache", latency: "~40 ns", barPct: 23, tier: "fast", note: "Shared across cores" },
  { level: "RAM", latency: "~100 ns", barPct: 28, tier: "fast", note: "Main memory" },
  { level: "SSD (NVMe)", latency: "~100 µs", barPct: 64, tier: "ok", note: "Local block device" },
  { level: "Redis / Memcached", latency: "~1 ms", barPct: 76, tier: "ok", note: "Network hop included" },
  { level: "HDD", latency: "~10 ms", barPct: 88, tier: "slow", note: "Rotational disk seek" },
  { level: "Network roundtrip", latency: "~100 ms", barPct: 100, tier: "slow", note: "Cross-continent" },
];

const TIER_COLORS: Record<string, { bar: string; text: string }> = {
  extreme: { bar: "bg-primary", text: "text-primary" },
  fast: { bar: "bg-blue-400", text: "text-blue-500" },
  ok: { bar: "bg-orange-400", text: "text-orange-500" },
  slow: { bar: "bg-destructive", text: "text-destructive" },
};

const CACHE_LAYERS = [
  { icon: "🌐", label: "Browser cache", latency: "0 ms", desc: "Assets stored on disk. No network request at all." },
  { icon: "🌍", label: "CDN edge", latency: "5–20 ms", desc: "Nearest point-of-presence serves the response. No origin hit." },
  { icon: "⚡", label: "App in-memory", latency: "<1 ms", desc: "Process-local memory: fastest, but lost on restart, not shared." },
  { icon: "🔴", label: "Redis / Memcached", latency: "1–5 ms", desc: "Shared distributed cache across all app instances." },
  { icon: "🗄️", label: "DB query cache", latency: "varies", desc: "Database-internal cache for repeated identical queries." },
  { icon: "💿", label: "DB disk", latency: "10–100 ms", desc: "Last resort: full table scan or index lookup from storage." },
];

export function WhatIsCachingSection() {
  return (
    <section>
      <h2 id="why-caching-matters" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Why Caching Matters
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A cache is a fast data store that sits between a requester and a slower data source.
        Instead of fetching the same data from a database or API on every request, you store
        the result once and serve it repeatedly from memory. The speed difference between
        storage levels is not incremental: it is orders of magnitude.
      </p>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          If a CPU cycle takes 1 second in human time, a RAM access takes 6 minutes.
          A disk read takes 6 months. A cross-continent network round-trip takes 10 years.
          Caching collapses that gap.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The memory hierarchy</h3>

      <div className="bg-card border border-border rounded-xl p-5 mb-8 not-prose space-y-2">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Latency by storage level (log scale)
        </p>
        {LATENCIES.map(({ level, latency, barPct, tier, note }) => {
          const colors = TIER_COLORS[tier];
          return (
            <div key={level} className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-medium text-foreground/80 w-40 flex-shrink-0">{level}</span>
                <span className={`font-mono font-semibold w-20 text-right flex-shrink-0 ${colors.text}`}>
                  {latency}
                </span>
                <span className="text-muted-foreground/50 text-[9px] hidden sm:block ml-3">{note}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                  style={{ width: `${Math.max(barPct, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The principle at the heart of caching is temporal locality: data accessed recently
        is likely to be accessed again soon. Most real workloads follow the Pareto principle,
        where 20% of the data handles 80% of the reads. A small cache covering the hot fraction
        of your data dramatically reduces load on your database.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Cache layers in a web system</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A request can be served by any of several cache layers before it reaches your database.
        Each layer a request avoids saves both latency and infrastructure cost.
      </p>

      <div className="space-y-2 mb-6">
        {CACHE_LAYERS.map(({ icon, label, latency, desc }, i) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 w-8 flex-shrink-0">
              <span className="text-[10px] font-mono text-muted-foreground/40 w-4">{i + 1}</span>
              <span>{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[12px] font-semibold">{label}</span>
                <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {latency}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          These layers compound. A CDN hit means zero app server load. An in-memory app cache hit
          means zero Redis network hop. Design your caching strategy as a hierarchy, not as a
          single layer bolted on at the end.
        </p>
      </div>
    </section>
  );
}
