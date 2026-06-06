export function AggregateFunctionsSection() {
  return (
    <section>
      <h2 id="aggregate-functions" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Aggregate Functions
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Aggregate functions take a set of rows and return a single value. They collapse many rows into one number. Used without GROUP BY, they collapse the entire table into one row.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "COUNT",
            detail: "count rows",
            desc: "COUNT(*) counts every row including NULLs. COUNT(column) counts only rows where that column is not NULL. COUNT(DISTINCT column) counts unique non-NULL values.",
          },
          {
            label: "SUM",
            detail: "total of numeric values",
            desc: "SUM adds up all values in the column. NULL values are ignored. SUM on an empty set returns NULL, not zero.",
          },
          {
            label: "AVG",
            detail: "arithmetic mean",
            desc: "AVG divides the sum by the count of non-NULL rows. NULL values are excluded from both the sum and the count. An empty set returns NULL.",
          },
          {
            label: "MIN / MAX",
            detail: "smallest and largest value",
            desc: "Works on numbers, strings (alphabetical), and dates. NULL values are ignored. On an empty set, both return NULL.",
          },
        ].map(({ label, detail, desc }) => (
          <div key={label} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center gap-3">
              <p className="text-[11px] font-semibold">{label}</p>
              <span className="text-[10px] text-muted-foreground">{detail}</span>
            </div>
            <div className="px-4 py-3 text-[11px] text-muted-foreground">
              {desc}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Whole-table aggregation (no GROUP BY)
SELECT
  COUNT(*)               AS total_orders,
  COUNT(shipped_at)      AS shipped_orders,   -- NULLs excluded
  COUNT(DISTINCT user_id) AS unique_customers,
  SUM(amount)            AS revenue,
  AVG(amount)            AS avg_order_value,
  MIN(amount)            AS smallest_order,
  MAX(amount)            AS largest_order
FROM orders;`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Notice that <code>COUNT(*)</code> and <code>COUNT(shipped_at)</code> return different numbers if some orders have not been shipped. The column version skips NULL rows. This is the most common COUNT mistake.
      </p>
    </section>
  );
}
