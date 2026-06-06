export function CorrelatedSection() {
  return (
    <section>
      <h2 id="correlated" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Correlated Subqueries
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A correlated subquery references a column from the outer query. Because of this, it cannot run independently. The database re-executes it once for every row the outer query processes.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- For each order, find all other orders by the same user
-- and check if this one is their largest
SELECT id, user_id, amount
FROM orders o
WHERE amount = (
  SELECT MAX(amount)
  FROM orders
  WHERE user_id = o.user_id  -- references outer query's row
);`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The subquery uses <code>o.user_id</code> from the outer query. For each row in orders, the database runs the inner query with that row's user_id to find the maximum amount for that user.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">EXISTS</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        EXISTS checks whether a subquery returns any rows at all. It does not care about the values — only whether at least one row matched. The database stops scanning as soon as it finds the first match.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Users who have placed at least one order
SELECT id, email
FROM users u
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.user_id = u.id
);

-- Users who have never placed an order
SELECT id, email
FROM users u
WHERE NOT EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.user_id = u.id
);`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The convention is to write <code>SELECT 1</code> inside EXISTS. The actual value does not matter — EXISTS only tests whether rows exist. Writing <code>SELECT *</code> works identically but <code>SELECT 1</code> signals intent.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "EXISTS stops at first match", desc: "The database does not scan the whole subquery result. It returns true as soon as one row is found. This makes EXISTS efficient when matches are common." },
          { label: "NOT EXISTS for absence", desc: "NOT EXISTS is the cleanest way to express 'no matching rows exist'. It handles NULLs correctly, unlike NOT IN." },
          { label: "IN with NULLs is dangerous", desc: "NOT IN returns no rows if any value in the list is NULL. This is because NULL comparisons produce UNKNOWN. NOT EXISTS does not have this problem." },
          { label: "Correlated = one run per row", desc: "Because the subquery depends on the outer row, it executes once per row. On large tables this can be slow — a JOIN often performs better." },
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
