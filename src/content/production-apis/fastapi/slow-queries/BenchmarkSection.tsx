import { BenchmarkChart } from "@/components/blog/interactive/benchmark-chart";

export function BenchmarkSection() {
  return (
    <section id="benchmark">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Benchmark: Before and After
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The benchmark requests page 501 (deep pagination) at two table sizes. Deep
        pagination is where offset pagination degrades most visibly -- it is also
        the access pattern that production systems hit when users scroll through
        older records or when background jobs process historical data.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <BenchmarkChart
          title="Page 501, table size: 100K rows"
          unit="ms"
          before={{ label: "Offset (OFFSET 10000)", p50: 620, p95: 1250, p99: 1890 }}
          after={{ label: "Cursor (index scan)", p50: 1, p95: 3, p99: 5 }}
          note="100 concurrent clients, local PostgreSQL"
        />
        <BenchmarkChart
          title="Page 501, table size: 1M rows"
          unit="ms"
          before={{ label: "Offset (OFFSET 10000)", p50: 8300, p95: 24000, p99: 30000 }}
          after={{ label: "Cursor (index scan)", p50: 1, p95: 3, p99: 6 }}
          note="Cursor cost stays flat regardless of table size"
        />
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The cursor approach does not degrade as the table grows. The index B-tree depth
        grows logarithmically -- a table 10x larger adds roughly one extra node traversal.
        For practical table sizes, cursor pagination latency is effectively constant.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">What we gave up</h3>

      <div className="space-y-2">
        {[
          {
            label: "Arbitrary page jumps are gone",
            detail: "Clients can no longer request page 47 directly. They must walk forward from the beginning. For most UIs (infinite scroll, load-more buttons) this is not a limitation. For spreadsheet-style UIs that let users jump to any page, offset pagination may be unavoidable.",
          },
          {
            label: "Stable cursors require stable ordering",
            detail: "Cursor pagination is only correct when the order column is immutable and unique enough that ties are rare. created_at can have millisecond ties if two tasks are inserted simultaneously. A composite cursor (created_at, id) is safer and removes the ambiguity entirely.",
          },
          {
            label: "Index adds write overhead",
            detail: "Every INSERT and UPDATE must maintain the idx_tasks_created_at index. At very high write throughput this overhead is measurable. For this API, reads outnumber writes by a wide margin -- the tradeoff is justified.",
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
