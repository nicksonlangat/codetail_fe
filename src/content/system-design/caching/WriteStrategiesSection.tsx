const STRATEGIES = [
  {
    name: "Cache-aside",
    aka: "Lazy loading",
    description:
      "The application manages the cache explicitly. On a read, check the cache first. On a miss, load from the database, write the result into the cache, and return it. On a write, update the database and delete (or update) the cache key.",
    readSteps: [
      { label: "App checks cache", result: "HIT? Return immediately." },
      { label: "Cache MISS", result: "Fetch from database." },
      { label: "Populate cache", result: "Store result. Return to caller." },
    ],
    writeSteps: [
      { label: "Write to database", result: "Source of truth updated." },
      { label: "Invalidate cache key", result: "Next read repopulates from DB." },
    ],
    pros: [
      "Cache only holds data that has actually been requested.",
      "Cache failures are transparent: the app falls back to the database.",
      "Works with any database. No special cache support required.",
    ],
    cons: [
      "First request after a miss pays the full database round-trip cost.",
      "Window of stale data between a write and the next cache population.",
      "Cache stampede risk: many processes miss simultaneously and hammer the DB.",
    ],
    verdict: "The right default for most read-heavy web applications.",
    highlight: true,
  },
  {
    name: "Write-through",
    aka: null,
    description:
      "Every write goes to the cache and the database synchronously. The cache is always up to date because it is updated on every write, not just on reads.",
    readSteps: [
      { label: "App checks cache", result: "Always a HIT (if key exists)." },
    ],
    writeSteps: [
      { label: "Write to cache", result: "Synchronous." },
      { label: "Write to database", result: "Also synchronous. Both succeed or both fail." },
    ],
    pros: [
      "Cache is always consistent with the database. No stale reads.",
      "Read performance is optimal once the cache is warm.",
    ],
    cons: [
      "Write latency is higher: must wait for both cache and DB.",
      "Cache fills with data that may never be read again (write-heavy workloads waste cache space).",
    ],
    verdict: "Good for write-then-read patterns where freshness is critical.",
    highlight: false,
  },
  {
    name: "Write-behind",
    aka: "Write-back",
    description:
      "Writes go to the cache immediately and return. The cache asynchronously flushes changes to the database in batches. The cache is the primary write target; the database is a secondary, eventually-consistent sink.",
    readSteps: [
      { label: "App checks cache", result: "HIT: serves latest data including unflushed writes." },
    ],
    writeSteps: [
      { label: "Write to cache", result: "Immediate. Fast response to caller." },
      { label: "Async flush to DB", result: "Batched. Happens in background." },
    ],
    pros: [
      "Lowest write latency: the caller is not blocked on a database write.",
      "Batching reduces database write amplification under high write volume.",
    ],
    cons: [
      "Data loss risk: if the cache crashes before flushing, writes are permanently lost.",
      "Significantly more complex to implement and reason about correctly.",
    ],
    verdict: "Use only when write latency is the bottleneck and data loss is acceptable.",
    highlight: false,
  },
];

export function WriteStrategiesSection() {
  return (
    <section>
      <h2 id="write-strategies" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Write Strategies
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Eviction policies decide what leaves the cache. Write strategies decide how the cache
        is populated and kept in sync with the database. They are separate decisions that
        combine independently.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-8">
        The central tension: you want fast reads (cache hits) but also fresh data (no stale reads)
        and safe writes (no data loss). No strategy gives you all three without trade-offs.
      </p>

      <div className="space-y-6">
        {STRATEGIES.map(({ name, aka, description, readSteps, writeSteps, pros, cons, verdict, highlight }) => (
          <div
            key={name}
            className={`rounded-xl border overflow-hidden ${
              highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card"
            }`}
          >
            <div className={`px-4 py-3 border-b flex items-center gap-2 ${
              highlight ? "border-primary/20 bg-primary/5" : "border-border bg-secondary/50"
            }`}>
              <span className="text-[13px] font-semibold">{name}</span>
              {aka && (
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {aka}
                </span>
              )}
              {highlight && (
                <span className="ml-auto text-[9px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  recommended default
                </span>
              )}
            </div>

            <div className="p-4 space-y-4">
              <p className="text-[12px] text-muted-foreground leading-relaxed">{description}</p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-2">
                    Read path
                  </p>
                  {readSteps.map((s, i) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                      <span className="text-[9px] font-mono text-muted-foreground/40 mt-0.5 flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-medium text-foreground/80">{s.label}</span>
                        <span className="text-muted-foreground"> — {s.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-2">
                    Write path
                  </p>
                  {writeSteps.map((s, i) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                      <span className="text-[9px] font-mono text-muted-foreground/40 mt-0.5 flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-medium text-foreground/80">{s.label}</span>
                        <span className="text-muted-foreground"> — {s.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-primary mb-1.5">Strengths</p>
                  <ul className="space-y-1">
                    {pros.map(p => (
                      <li key={p} className="flex gap-1.5 text-muted-foreground">
                        <span className="text-primary flex-shrink-0">+</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-orange-500 mb-1.5">Weaknesses</p>
                  <ul className="space-y-1">
                    {cons.map(c => (
                      <li key={c} className="flex gap-1.5 text-muted-foreground">
                        <span className="text-orange-500 flex-shrink-0">-</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-[11px] border-t border-border/50 pt-3 text-muted-foreground">
                <span className="font-semibold text-foreground">When to use: </span>{verdict}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
