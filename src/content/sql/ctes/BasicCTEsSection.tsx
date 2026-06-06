export function BasicCTEsSection() {
  return (
    <section>
      <h2 id="basic-ctes" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        The WITH Clause
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A CTE gives a name to a subquery so you can reference it by name in the main query. It does not change what the query computes — it only changes how you write it.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The syntax starts with <code>WITH</code>, followed by the CTE name, the keyword <code>AS</code>, and the subquery in parentheses. The main query comes after.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Without a CTE: derived table buried in FROM
SELECT u.email, order_stats.order_count
FROM users u
JOIN (
  SELECT user_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY user_id
) AS order_stats ON u.id = order_stats.user_id
WHERE order_stats.order_count > 5;

-- With a CTE: named and readable
WITH order_stats AS (
  SELECT user_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY user_id
)
SELECT u.email, s.order_count
FROM users u
JOIN order_stats s ON u.id = s.user_id
WHERE s.order_count > 5;`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The two queries are identical in what they return. The CTE version is easier to read because the subquery has a name and sits at the top, separated from the main logic.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Chaining multiple CTEs</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        You can define multiple CTEs in a single WITH clause, separated by commas. Each CTE can reference the CTEs defined before it.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`WITH
  -- Step 1: aggregate orders per user
  order_stats AS (
    SELECT user_id, COUNT(*) AS order_count, SUM(amount) AS total_spent
    FROM orders
    WHERE status = 'completed'
    GROUP BY user_id
  ),
  -- Step 2: classify users using step 1's results
  user_segments AS (
    SELECT
      user_id,
      total_spent,
      CASE
        WHEN total_spent >= 1000 THEN 'high'
        WHEN total_spent >= 200  THEN 'mid'
        ELSE 'low'
      END AS segment
    FROM order_stats
  )
-- Main query: join back to users
SELECT u.email, s.total_spent, s.segment
FROM users u
JOIN user_segments s ON u.id = s.user_id
ORDER BY s.total_spent DESC;`}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "CTEs are not materialized by default", desc: "Most databases treat a CTE as a macro — they inline it into the query rather than storing the result. PostgreSQL materializes CTEs only when it chooses to (or when you use MATERIALIZED)." },
          { label: "Each CTE is readable in isolation", desc: "A well-named CTE reads like a sentence. order_stats, user_segments, monthly_revenue — you can understand each step without reading the whole query." },
          { label: "Later CTEs can reference earlier ones", desc: "CTEs are defined in order. The second CTE can reference the first. The main query can reference any of them." },
          { label: "CTEs scope to the query", desc: "A CTE only exists within the query it belongs to. You cannot reference it from a different statement." },
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
