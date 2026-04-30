import { BenchmarkChart } from "@/components/blog/interactive/benchmark-chart";

export function BenchmarkSection() {
  return (
    <section id="benchmark">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Benchmark: Before and After</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The benchmark runs 100 concurrent clients each sending 50 requests to
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> POST /tasks</code> and
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> GET /tasks</code> against
        a local instance. The before numbers reflect the SQLite baseline; the after
        numbers reflect PostgreSQL with the async rewrite.
      </p>

      <BenchmarkChart
        title="Latency at 100 concurrent clients (lower is better)"
        unit="ms"
        before={{ label: "Baseline (SQLite + sync)", p50: 85, p95: 2340, p99: 5800 }}
        after={{ label: "After (PostgreSQL + async)", p50: 11, p95: 36, p99: 64 }}
        note="Measured with wrk2 against a local Docker PostgreSQL instance. The baseline p99 includes request timeouts and OperationalError failures counted as high-latency events."
      />

      <div className="mt-6 space-y-2">
        {[
          {
            label: "Median improved 87%",
            detail: "The baseline median looks acceptable at 85ms, but it hides the severity of the problem. p50 only reflects the best half of requests. The tail is where users feel pain.",
          },
          {
            label: "p99 improved 99%",
            detail: "5,800ms p99 in the baseline is mostly database lock timeouts and errors. After the fix, p99 is 64ms -- every request completes successfully, the worst case is just a slightly slower connection pool checkout.",
          },
        ].map(({ label, detail }) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">+</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{label}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">What we gave up</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Every fix has a cost. The async rewrite is not free.
      </p>

      <div className="space-y-2">
        {[
          {
            label: "Operational complexity",
            detail: "The project now requires a running PostgreSQL instance. Local development needs Docker or a cloud database. The SQLite 'just works' experience is gone.",
          },
          {
            label: "async def is viral",
            detail: "Making handlers async means every helper function they call must also be async, or must be wrapped in run_in_executor. This is a one-way migration -- you cannot mix sync and async SQLAlchemy sessions.",
          },
          {
            label: "Migration tooling is split",
            detail: "Alembic cannot use the async engine directly. psycopg2 is added as a dev dependency purely so Alembic can connect synchronously. Two drivers, same database, different purposes.",
          },
        ].map(({ label, detail }) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-border/50 bg-muted/30">
            <span className="text-muted-foreground font-bold text-sm flex-shrink-0 mt-0.5">-</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5 text-foreground/70">{label}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
