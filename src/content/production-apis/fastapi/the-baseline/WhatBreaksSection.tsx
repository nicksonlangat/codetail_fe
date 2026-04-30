const FAILURE_MODES = [
  {
    icon: "🔒",
    title: "SQLite under concurrent writes",
    when: "2+ simultaneous POST requests",
    symptom: 'OperationalError: database is locked',
    why: "SQLite uses file-level locking. One writer holds an exclusive lock on the entire database file. Any concurrent writer waits, and with no timeout configured, it raises immediately.",
    fix: "Article 2: migrate to PostgreSQL",
  },
  {
    icon: "🧵",
    title: "Synchronous handlers block the event loop",
    when: "100+ concurrent requests",
    symptom: "Workers queue up; p99 latency climbs linearly",
    why: "FastAPI runs on ASGI, which is designed for async code. These handlers are sync def, not async def. Each database call blocks the thread completely while waiting for I/O to return.",
    fix: "Article 2: rewrite handlers as async def with asyncpg",
  },
  {
    icon: "🔌",
    title: "No connection pool",
    when: "Sustained load",
    symptom: "Connection setup latency adds 5-20ms to every request",
    why: "get_db() opens a new SQLite connection on every request and closes it on exit. At high request rates, the overhead of creating and destroying connections becomes measurable.",
    fix: "Article 2: SQLAlchemy connection pool with asyncpg",
  },
  {
    icon: "💔",
    title: "No health check endpoint",
    when: "On deployment behind a load balancer",
    symptom: "Load balancer routes traffic to a crashed instance",
    why: "There is no /health route. Load balancers, Kubernetes, and ECS all need an endpoint to poll. Without one, they cannot distinguish a running app from a crashed process.",
    fix: "Article 2: add /health returning {status: ok}",
  },
  {
    icon: "🐢",
    title: "Full table scan on GET /tasks",
    when: "Table grows past ~100,000 rows",
    symptom: "List endpoint p99 exceeds 500ms",
    why: 'db.query(Task).offset(skip).limit(limit) does a sequential scan of the entire table. The database must read and discard the first skip rows before returning limit results. "OFFSET 10000 LIMIT 20" reads 10,020 rows to return 20.',
    fix: "Article 3: composite index and cursor-based pagination",
  },
];

export function WhatBreaksSection() {
  return (
    <section id="what-breaks">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">What Will Break First</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The baseline works for a single developer making occasional requests. Each of the
        five issues below is invisible at this scale and inevitable at production scale.
        Every subsequent article in this series exists to fix one of them.
      </p>

      <div className="space-y-3">
        {FAILURE_MODES.map(({ icon, title, when, symptom, why, fix }) => (
          <div key={title} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <span>{icon}</span>
                <span className="text-[11px] font-semibold">{title}</span>
              </div>
              <span className="text-[9px] text-muted-foreground font-mono">triggers at: {when}</span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <p className="text-[11px]">
                <span className="font-medium text-foreground/80">Symptom: </span>
                <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">{symptom}</code>
              </p>
              <p className="text-[11px] text-muted-foreground">{why}</p>
              <p className="text-[11px]">
                <span className="font-medium text-primary">Fixed in: </span>
                <span className="text-muted-foreground">{fix}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-1">
        <p className="font-semibold text-foreground/80">The right approach</p>
        <p className="text-muted-foreground">
          None of these are mistakes. Starting simple is correct. The mistake is staying simple
          after the constraints change. This series tracks exactly when each issue becomes real
          and shows the minimum change needed to fix it.
        </p>
      </div>
    </section>
  );
}
