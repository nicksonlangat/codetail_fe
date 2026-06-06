export function PracticalPatternsSection() {
  return (
    <section>
      <h2 id="practical-patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Practical Patterns
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Real queries often join more than two tables. You chain joins by adding more JOIN clauses. Each one attaches another table to the result of the previous joins.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Joining multiple tables</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- orders -> users -> companies
SELECT
  o.id         AS order_id,
  o.amount,
  u.email      AS user_email,
  c.name       AS company_name
FROM orders o
JOIN users u        ON o.user_id = u.id
JOIN companies c    ON u.company_id = c.id
WHERE o.amount > 500;`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Joining a table to itself</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A self join joins a table to itself. This is common in hierarchical data where rows reference other rows in the same table. Aliases are required to distinguish the two copies.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- employees table has a manager_id column pointing to employees.id
SELECT
  e.name     AS employee,
  m.name     AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Filtering joined results</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        You can filter on columns from any joined table in the WHERE clause. But for LEFT JOINs, filtering on a right-table column in WHERE turns it into an INNER JOIN because NULL rows fail the filter.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- This behaves like an INNER JOIN, not a LEFT JOIN
-- Users with no orders are excluded because o.amount IS NULL
SELECT u.id, u.email
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.amount > 100;  -- NULL fails this check

-- Move the filter into the ON clause to keep all users
SELECT u.id, u.email, o.amount
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.amount > 100;`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Putting a condition in ON means it is evaluated during the join. Rows that fail still appear, with NULL in the joined columns. Putting it in WHERE filters after the join, which removes those NULL rows.
      </p>

      <div className="space-y-3 mb-6">
        {[
          {
            label: "Use INNER JOIN by default",
            detail: "when unmatched rows should not appear",
            desc: "If a missing related record means the result row is meaningless, use INNER JOIN. An order without a user record is probably data corruption, not useful output.",
          },
          {
            label: "Use LEFT JOIN for optional relationships",
            detail: "when the relationship may not exist",
            desc: "User profiles, shipping addresses, optional settings — use LEFT JOIN when the related record may legitimately not exist and you still want the primary row.",
          },
          {
            label: "Filter in ON, not WHERE, for LEFT JOINs",
            detail: "to preserve unmatched rows",
            desc: "If you need to filter joined table rows but still keep left-table rows with no match, put the condition in the ON clause rather than WHERE.",
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
