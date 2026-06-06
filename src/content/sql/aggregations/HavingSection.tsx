export function HavingSection() {
  return (
    <section>
      <h2 id="having" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        HAVING
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        HAVING filters groups after they have been formed. WHERE filters rows before grouping. The difference matters: WHERE cannot reference aggregate results, but HAVING can.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "WHERE",
            detail: "filters rows before grouping",
            desc: "Evaluated on individual rows. Reduces the set of rows that will be grouped. Cannot reference COUNT, SUM, or any other aggregate — the groups do not exist yet when WHERE runs.",
          },
          {
            label: "HAVING",
            detail: "filters groups after grouping",
            desc: "Evaluated on each group after GROUP BY. Can reference aggregate functions. Removes entire groups from the result. Rows within excluded groups simply do not appear.",
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

      <h3 className="text-base font-semibold mt-8 mb-3">Examples</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Users who have placed more than 5 orders
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5;

-- Countries with more than $10,000 in revenue from completed orders
-- WHERE filters rows first (only completed orders are grouped)
-- HAVING filters groups after (only high-revenue countries appear)
SELECT country, SUM(amount) AS revenue
FROM orders
WHERE status = 'completed'
GROUP BY country
HAVING SUM(amount) > 10000
ORDER BY revenue DESC;

-- ERROR: cannot use aggregate in WHERE
SELECT country, SUM(amount) AS revenue
FROM orders
WHERE SUM(amount) > 10000   -- this fails
GROUP BY country;`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Query execution order</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        SQL clauses run in a specific order, not the order they appear in the query. Understanding this order explains every restriction about which clauses can reference what.
      </p>

      <div className="space-y-2 mb-6">
        {[
          { step: "1", clause: "FROM", desc: "Load the source table (and apply JOINs)" },
          { step: "2", clause: "WHERE", desc: "Filter individual rows" },
          { step: "3", clause: "GROUP BY", desc: "Divide remaining rows into groups" },
          { step: "4", clause: "HAVING", desc: "Filter groups using aggregate results" },
          { step: "5", clause: "SELECT", desc: "Compute the output columns" },
          { step: "6", clause: "ORDER BY", desc: "Sort the result" },
          { step: "7", clause: "LIMIT", desc: "Restrict the number of rows returned" },
        ].map(({ step, clause, desc }) => (
          <div key={step} className="flex items-center gap-3 px-4 py-2.5 bg-card border border-border rounded-xl">
            <span className="text-[10px] font-mono text-muted-foreground w-4 flex-shrink-0">{step}</span>
            <span className="text-[11px] font-semibold w-20 flex-shrink-0">{clause}</span>
            <span className="text-[11px] text-muted-foreground">{desc}</span>
          </div>
        ))}
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        This is why you cannot reference a SELECT alias in WHERE or GROUP BY — those clauses run before SELECT. You can reference a SELECT alias in ORDER BY because ORDER BY runs after SELECT.
      </p>
    </section>
  );
}
