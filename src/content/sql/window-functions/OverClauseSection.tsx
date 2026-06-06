export function OverClauseSection() {
  return (
    <section>
      <h2 id="over-clause" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        The OVER Clause
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A window function computes a value for each row using a set of related rows — the window. Unlike GROUP BY, the rows are not collapsed. Every row keeps its own identity in the result and gets its own computed value.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The OVER clause is what makes a function a window function. It defines the window: which rows are included and in what order. An empty OVER means the window is the entire result set.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Aggregate: collapses all rows into one
SELECT AVG(amount) FROM orders;

-- Window function: adds the average to every row
SELECT id, amount, AVG(amount) OVER () AS avg_amount
FROM orders;`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">PARTITION BY</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        PARTITION BY splits rows into groups before the function runs. The function computes independently within each partition. This is like GROUP BY for window functions — except rows are still not collapsed.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Average amount per country, shown on every row
SELECT
  id,
  country,
  amount,
  AVG(amount) OVER (PARTITION BY country) AS country_avg
FROM orders;

-- Result: every row has the average for its own country
-- id  country  amount  country_avg
-- 1   US       120     95.0
-- 2   US       70      95.0
-- 3   UK       200     175.0
-- 4   UK       150     175.0`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">ORDER BY inside OVER</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        ORDER BY inside OVER controls two things: ranking functions use it to determine position, and aggregate functions use it to define a running frame — rows from the first row in the partition up to the current row.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Running total of amount, ordered by date
SELECT
  id,
  created_at,
  amount,
  SUM(amount) OVER (ORDER BY created_at) AS running_total
FROM orders;

-- Running total reset per user
SELECT
  id,
  user_id,
  amount,
  SUM(amount) OVER (PARTITION BY user_id ORDER BY created_at) AS user_running_total
FROM orders;`}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "OVER () — whole result set", desc: "An empty OVER means the window is every row in the result. The function sees all rows at once." },
          { label: "PARTITION BY — subgroups", desc: "Divides rows into independent groups. The function resets and runs separately within each partition." },
          { label: "ORDER BY inside OVER", desc: "Controls row order within the window. Required for ranking functions. Triggers a running frame for aggregate functions." },
          { label: "Rows are never collapsed", desc: "No matter how the window is defined, each row in the input produces exactly one row in the output." },
        ].map(({ label, desc }) => (
          <div key={label} className="p-3 bg-card border border-border rounded-xl">
            <p className="text-[12px] font-semibold mb-1">{label}</p>
            <p className="text-[11px] text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
