import { QueryPlanViewer } from "@/components/blog/interactive/query-plan-viewer";

export function DiagnoseSection() {
  return (
    <section id="diagnose">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Diagnosing Slow Queries
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The list endpoint works at 1,000 rows. At 100,000 rows it begins timing out
        at the 99th percentile. At 1,000,000 rows it times out for every request
        past page 10. The problem is not traffic -- it is the query itself.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Enable the slow query log</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Before guessing, configure PostgreSQL to log queries that exceed a threshold.
        Set <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">log_min_duration_statement</code> in
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> postgresql.conf</code> or
        pass it as a connection parameter:
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Option A: postgresql.conf
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# Log all queries taking longer than 200ms
log_min_duration_statement = 200`}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Option B: per-connection (development only)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`engine = create_async_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    connect_args={"options": "-c log_min_duration_statement=200"},
)`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        With logging enabled, the culprit appears immediately:
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-8 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          postgres log output
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`2026-04-30 09:14:22 UTC [1247] LOG: duration: 1247.934 ms
  statement: SELECT tasks.id, tasks.title, tasks.description,
             tasks.done, tasks.created_at
             FROM tasks ORDER BY tasks.created_at DESC
             LIMIT 20 OFFSET 10000`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Read the query plan</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">EXPLAIN ANALYZE</code> executes
        the query and returns the execution plan with actual timings. Toggle between
        before and after the index to see what changes.
      </p>

      <QueryPlanViewer />

      <div className="mt-4 space-y-2">
        {[
          {
            term: "Seq Scan",
            def: "PostgreSQL reads every row in the table from disk, in heap order. Cost is O(n) -- doubling the table doubles the time.",
          },
          {
            term: "external merge  Disk: 11648kB",
            def: "The sort operation did not fit in work_mem and spilled to disk. Disk I/O is orders of magnitude slower than memory. This compounds the Seq Scan cost.",
          },
          {
            term: "Index Scan",
            def: "PostgreSQL follows the index B-tree to find the matching rows directly, then fetches only those rows from the heap. Cost is O(log n + k) where k is the number of rows returned.",
          },
        ].map(({ term, def }) => (
          <div key={term} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">?</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5 font-mono">{term}</p>
              <p className="text-[11px] text-muted-foreground">{def}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">What the slow query log does not catch: N+1</p>
        <p className="text-muted-foreground">
          If your endpoint runs 100 individually fast queries (e.g., fetch a list of tasks,
          then fetch the tags for each task in a separate query), none of them exceed the
          threshold. The total time is 100x the single-query cost, but the log is silent.
          Watch query count per request, not just query duration. In SQLAlchemy, set
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]"> echo=True</code> on
          the engine during development to see every query executed.
        </p>
      </div>
    </section>
  );
}
