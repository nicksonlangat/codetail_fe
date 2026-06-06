export function JoinTypesSection() {
  return (
    <section>
      <h2 id="join-types" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        JOIN Types
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The difference between JOIN types is what happens to rows that have no match in the other table. INNER JOIN drops them. Outer joins keep them.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "INNER JOIN",
            detail: "only matched rows",
            desc: "Returns rows where the ON condition matches in both tables. Rows in either table with no match are excluded. This is the default — JOIN and INNER JOIN are identical.",
          },
          {
            label: "LEFT JOIN",
            detail: "all left rows, matched right rows",
            desc: "Returns every row from the left table. If a row has no match in the right table, it is still included with NULL for all right-table columns. Use this when you want results even if the related record does not exist.",
          },
          {
            label: "RIGHT JOIN",
            detail: "all right rows, matched left rows",
            desc: "Returns every row from the right table. Same as LEFT JOIN but from the opposite side. In practice, you can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the table order.",
          },
          {
            label: "FULL OUTER JOIN",
            detail: "all rows from both tables",
            desc: "Returns every row from both tables. Where no match exists on either side, the missing columns are NULL. Not supported by MySQL — use a UNION of LEFT and RIGHT JOINs instead.",
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

      <h3 className="text-base font-semibold mt-8 mb-3">INNER JOIN example</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        This returns only orders that have a matching user. If a user_id references a user that was deleted, that order is excluded.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`SELECT o.id, o.amount, u.email
FROM orders o
INNER JOIN users u ON o.user_id = u.id;

-- INNER JOIN and JOIN are identical
SELECT o.id, o.amount, u.email
FROM orders o
JOIN users u ON o.user_id = u.id;`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">LEFT JOIN example</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        This returns all users, including those who have never placed an order. The order columns will be NULL for those users.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- All users, with their order count (0 if none)
SELECT u.id, u.email, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.email;

-- Find users with no orders at all
SELECT u.id, u.email
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The pattern <code>LEFT JOIN ... WHERE right_table.id IS NULL</code> is a standard way to find rows with no match. It finds users who have no orders, orders that have no invoices, and so on.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">FULL OUTER JOIN example</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- PostgreSQL: FULL OUTER JOIN
SELECT u.id AS user_id, o.id AS order_id
FROM users u
FULL OUTER JOIN orders o ON o.user_id = u.id;

-- MySQL workaround (no FULL OUTER JOIN support)
SELECT u.id AS user_id, o.id AS order_id
FROM users u LEFT JOIN orders o ON o.user_id = u.id
UNION
SELECT u.id AS user_id, o.id AS order_id
FROM users u RIGHT JOIN orders o ON o.user_id = u.id;`}
        </pre>
      </div>
    </section>
  );
}
