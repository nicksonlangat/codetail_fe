import { BenchmarkChart } from "@/components/blog/interactive/benchmark-chart";

export function BenchmarkSection() {
  return (
    <section id="benchmark">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Benchmark: Before and After</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Measured with{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">wrk</code>{" "}
        at 100 concurrent connections on a task record with a 200-character description.
        The before baseline has no caching. The after state has Redis cache-aside, a 5-minute
        TTL, and explicit invalidation on write. Both runs warmed the cache for 10 seconds
        before measurement.
      </p>

      <BenchmarkChart
        title="GET /tasks/{id} latency at 100 RPS"
        unit="ms"
        before={{ label: "No cache (DB on every request)", p50: 42, p95: 138, p99: 201 }}
        after={{ label: "Redis cache-aside (5-min TTL)", p50: 4, p95: 11, p99: 18 }}
        note="Measured on a single-node FastAPI app with asyncpg pool (size=10) and Redis on localhost. Cache hit rate ~94% after warm-up."
      />

      <div className="mt-6">
        <BenchmarkChart
          title="GET /tasks (list, 20 items) latency at 100 RPS"
          unit="ms"
          before={{ label: "TaskDetail model (8 fields)", p50: 38, p95: 94, p99: 142 }}
          after={{ label: "TaskSummary model (4 fields)", p50: 29, p95: 72, p99: 108 }}
          note="Response model trimming alone reduces p95 by ~23%. The list endpoint is not cached; gains come from reduced serialization and smaller payload."
        />
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Why the list endpoint still misses the 100ms target</p>
        <p className="text-muted-foreground">
          The list endpoint at p95 is 72ms — within target. But p99 is 108ms, just above. The
          remaining variance comes from database query time on a cold connection and Pydantic
          serializing 20 records. The next lever is SQL projection: fetch only the four
          summary fields from the database instead of loading the full ORM object and
          projecting in Python. At this traffic level the difference is measurable but
          not worth the added complexity.
        </p>
      </div>
    </section>
  );
}
