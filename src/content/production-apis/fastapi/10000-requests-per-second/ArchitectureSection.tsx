const COMPONENTS = [
  {
    layer: "Edge",
    components: ["Load balancer (Nginx / AWS ALB)", "Rate limiting (per-user token bucket, Redis-backed)", "TLS termination"],
    note: "Handles connection routing, rate limiting, and TLS before traffic reaches app instances.",
  },
  {
    layer: "Application (N instances)",
    components: ["FastAPI + Uvicorn (4 workers per instance)", "Stateless — no local session or file state", "Connection pool to Redis + PostgreSQL primary + replica"],
    note: "Horizontally scalable. Any instance can handle any request. Add instances to scale horizontally.",
  },
  {
    layer: "Cache",
    components: ["Redis (single node or Redis Cluster)", "Task detail cache (TTL 5 min, invalidated on write)", "Rate limit counters (token bucket, per user)", "Celery broker and result backend"],
    note: "Serves ~94% of detail reads without touching the database. Also backs rate limiting and job queue.",
  },
  {
    layer: "Database",
    components: ["PostgreSQL primary (writes)", "1+ read replicas (reads)", "Connection pool: 10 primary, 20 per replica"],
    note: "Primary handles all writes. Replicas handle all reads. Replication lag: 50-200ms.",
  },
  {
    layer: "Worker fleet",
    components: ["Celery workers (N processes)", "Consume from Redis task queue", "acks_late=True for durability"],
    note: "Handles work moved out of the request path: webhooks, notifications, enrichment.",
  },
];

const EVOLUTION_STEPS = [
  { article: "1", label: "SQLite + sync endpoints", components: 1 },
  { article: "2", label: "PostgreSQL + async + health check", components: 2 },
  { article: "3", label: "Indexes + cursor pagination", components: 2 },
  { article: "4", label: "JWT auth + user-scoped queries", components: 2 },
  { article: "5", label: "Structured logs + metrics + tracing", components: 2 },
  { article: "6", label: "Input validation + CORS + security headers", components: 2 },
  { article: "7", label: "Redis cache layer", components: 3 },
  { article: "8", label: "Graceful shutdown + health probes", components: 3 },
  { article: "9", label: "Timeouts + circuit breaker + retry", components: 3 },
  { article: "10", label: "LB + N instances + read replica + Celery", components: 5 },
];

export function ArchitectureSection() {
  return (
    <section id="architecture">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">The Final Architecture</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The API started as a single process with SQLite. After ten articles, it is a
        five-layer system capable of 10,000 RPS with p95 under 100ms. Every layer was
        added in response to a specific constraint — not designed upfront.
      </p>

      <div className="space-y-3 mb-8">
        {COMPONENTS.map(({ layer, components, note }) => (
          <div key={layer} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{layer}</span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {components.map((c) => (
                  <span key={c} className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{note}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-4">The constraint arc: article by article</h3>

      <div className="space-y-1.5">
        {EVOLUTION_STEPS.map(({ article, label, components }) => (
          <div key={article} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
            <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0 w-14 text-center">
              Art. {article}
            </span>
            <span className="text-[11px] text-muted-foreground flex-1">{label}</span>
            <div className="flex gap-0.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-sm ${
                    i < components ? "bg-primary/60" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">What 10k RPS actually requires</p>
        <p className="text-muted-foreground">
          The architecture described here handles 10k RPS for a read-heavy task management
          workload with aggressive caching. For write-heavy workloads (payment processing,
          audit logs, analytics ingestion), the bottleneck shifts to the database write path
          and the solutions change: write batching, event sourcing, sharding. The constraint
          arc is the same; the specific fixes are different.
        </p>
      </div>
    </section>
  );
}
