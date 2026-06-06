export function WhenToUseSection() {
  return (
    <section>
      <h2 id="when-to-use" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        IN vs EXISTS vs JOIN
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        IN, EXISTS, and JOIN can often express the same result. The right choice depends on what you are asking and what the data looks like.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "Use IN",
            detail: "small, known value lists",
            desc: "IN is readable and performs well when the subquery returns a small result set. Avoid NOT IN when the subquery column can contain NULLs — any NULL in the list causes NOT IN to return no rows.",
          },
          {
            label: "Use EXISTS",
            detail: "checking for presence or absence",
            desc: "EXISTS is the right choice when you only need to know whether a match exists, not what it contains. NOT EXISTS is always safe with NULLs, unlike NOT IN. Use it for 'find rows with no related record'.",
          },
          {
            label: "Use JOIN",
            detail: "when you need columns from both tables",
            desc: "If you need to SELECT columns from the related table, use a JOIN. JOINs also let the query planner optimize across both tables at once, which is often faster than a correlated subquery.",
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

      <h3 className="text-base font-semibold mt-8 mb-3">The NOT IN NULL trap</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        This is one of the most common silent bugs in SQL. When any value in a NOT IN list is NULL, the entire condition returns no rows.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Suppose cancelled_orders has a NULL user_id row

-- This returns NO rows if any user_id in cancelled_orders is NULL
SELECT id, email
FROM users
WHERE id NOT IN (SELECT user_id FROM cancelled_orders);

-- NULL comparison: id != NULL produces UNKNOWN, not FALSE
-- UNKNOWN in NOT IN means the whole condition is UNKNOWN
-- UNKNOWN rows are excluded — same as FALSE

-- Safe alternative: NOT EXISTS handles NULLs correctly
SELECT id, email
FROM users u
WHERE NOT EXISTS (
  SELECT 1
  FROM cancelled_orders c
  WHERE c.user_id = u.id
);`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Rewriting a correlated subquery as a JOIN</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Correlated subquery: runs once per user row
SELECT id, email
FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- Equivalent JOIN: often faster on large tables
SELECT DISTINCT u.id, u.email
FROM users u
JOIN orders o ON o.user_id = u.id;

-- Or with a derived table to avoid DISTINCT
SELECT u.id, u.email
FROM users u
JOIN (
  SELECT DISTINCT user_id FROM orders
) o ON o.user_id = u.id;`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Modern query planners often rewrite correlated subqueries as joins automatically. But understanding the equivalence helps you read query plans and write queries that perform predictably.
      </p>
    </section>
  );
}
