export function GroupBySection() {
  return (
    <section>
      <h2 id="group-by" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        GROUP BY
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        GROUP BY splits rows into groups before the aggregate functions run. Instead of one number for the whole table, you get one number per group.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The columns in GROUP BY determine what defines a group. Every unique combination of those column values becomes its own group, and aggregate functions run independently on each group.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Revenue per country
SELECT country, SUM(amount) AS revenue
FROM orders
GROUP BY country;

-- Order count per user
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id;

-- Revenue per country per month
SELECT
  country,
  DATE_TRUNC('month', created_at) AS month,
  SUM(amount) AS revenue
FROM orders
GROUP BY country, DATE_TRUNC('month', created_at);`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The GROUP BY rule</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Every column in SELECT must either appear in GROUP BY or be inside an aggregate function. This rule exists because after grouping, each group produces one output row. A column not in GROUP BY could have many different values within the group — the database has no way to pick one.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- ERROR: email is not in GROUP BY and not aggregated
SELECT user_id, email, COUNT(*) AS order_count
FROM orders
GROUP BY user_id;

-- Correct: email is in GROUP BY
SELECT user_id, email, COUNT(*) AS order_count
FROM orders
GROUP BY user_id, email;

-- Also correct: email is aggregated (picks any value)
SELECT user_id, MAX(email) AS email, COUNT(*) AS order_count
FROM orders
GROUP BY user_id;`}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "GROUP BY runs before SELECT", desc: "SQL groups the rows first, then computes the SELECT expressions on each group. You cannot reference a SELECT alias in GROUP BY." },
          { label: "Multiple columns = combined key", desc: "GROUP BY country, status creates one group for each unique (country, status) pair. 'US' and 'active' is a different group than 'US' and 'inactive'." },
          { label: "ORDER BY on aggregates", desc: "You can sort by an aggregate result: ORDER BY COUNT(*) DESC gives you the groups with the most rows first." },
          { label: "NULL forms its own group", desc: "Rows where the GROUP BY column is NULL are placed in their own group together. They are not excluded." },
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
