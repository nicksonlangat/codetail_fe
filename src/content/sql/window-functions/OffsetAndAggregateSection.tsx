export function OffsetAndAggregateSection() {
  return (
    <section>
      <h2 id="offset-and-aggregate" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        LAG, LEAD, and Aggregate Windows
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        LAG and LEAD look at other rows relative to the current one. Aggregate window functions apply SUM, AVG, COUNT, and similar functions across a window without collapsing rows.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">LAG and LEAD</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        LAG returns a value from a previous row in the window. LEAD returns a value from a following row. Both require ORDER BY inside OVER to define what "previous" and "next" mean.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Compare each month's revenue to the previous month
SELECT
  month,
  revenue,
  LAG(revenue)  OVER (ORDER BY month) AS prev_month,
  LEAD(revenue) OVER (ORDER BY month) AS next_month,
  revenue - LAG(revenue) OVER (ORDER BY month) AS change
FROM monthly_revenue;

-- month     revenue  prev_month  next_month  change
-- 2024-01   10000    NULL        12000       NULL
-- 2024-02   12000    10000       9500        2000
-- 2024-03   9500     12000       NULL        -2500`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The first row has no previous row, so LAG returns NULL. The last row has no next row, so LEAD returns NULL. You can provide a default as the second argument: <code>LAG(revenue, 1, 0)</code> returns 0 instead of NULL.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- LAG/LEAD signature: function(column, offset, default)
-- offset defaults to 1 (one row back or forward)

-- Revenue two months ago, defaulting to 0
LAG(revenue, 2, 0) OVER (ORDER BY month)

-- Per-user: compare each order to the user's previous order
LAG(amount) OVER (PARTITION BY user_id ORDER BY created_at)`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Aggregate window functions</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Standard aggregate functions (SUM, AVG, COUNT, MIN, MAX) become window functions when used with OVER. Adding ORDER BY inside OVER changes the frame from the whole partition to a running frame that grows with each row.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Running total across all orders
SELECT
  id,
  created_at,
  amount,
  SUM(amount) OVER (ORDER BY created_at) AS running_total
FROM orders;

-- Running total per user, reset for each user
SELECT
  id,
  user_id,
  amount,
  SUM(amount) OVER (PARTITION BY user_id ORDER BY created_at) AS user_running_total
FROM orders;

-- 7-day rolling average per country
SELECT
  day,
  country,
  daily_revenue,
  AVG(daily_revenue) OVER (
    PARTITION BY country
    ORDER BY day
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7d_avg
FROM daily_stats;`}
        </pre>
      </div>

      <div className="space-y-3 mb-6">
        {[
          {
            label: "ROWS BETWEEN",
            detail: "explicit frame definition",
            desc: "Controls exactly which rows the function sees. ROWS BETWEEN 6 PRECEDING AND CURRENT ROW means the current row and the 6 rows before it — a 7-row rolling window.",
          },
          {
            label: "RANGE BETWEEN",
            detail: "frame by value, not row count",
            desc: "RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW includes all rows with an ORDER BY value less than or equal to the current row's. Useful for handling ties in running totals.",
          },
          {
            label: "No ORDER BY = whole partition",
            detail: "SUM OVER (PARTITION BY x)",
            desc: "Without ORDER BY, the aggregate function sees the entire partition. SUM(amount) OVER (PARTITION BY country) gives the total for the country on every row — useful for computing percentages.",
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
    </section>
  );
}
