export function NonCorrelatedSection() {
  return (
    <section>
      <h2 id="non-correlated" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Non-Correlated Subqueries
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A non-correlated subquery runs once and returns a result that the outer query uses. It does not reference any column from the outer query, so the database can execute it independently.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Scalar subqueries</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A scalar subquery returns exactly one row and one column. You can use it anywhere a single value is expected: in SELECT, WHERE, or HAVING.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Compare each order's amount to the overall average
SELECT
  id,
  amount,
  (SELECT AVG(amount) FROM orders) AS avg_amount,
  amount - (SELECT AVG(amount) FROM orders) AS diff_from_avg
FROM orders;

-- Find orders above the average
SELECT id, amount
FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders);`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        If a scalar subquery returns more than one row, the query fails with an error. If it returns zero rows, the result is NULL.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Subqueries with IN</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A subquery inside IN returns a list of values. The outer query keeps rows where the column matches any value in that list.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Orders placed by users in the US
SELECT id, amount
FROM orders
WHERE user_id IN (
  SELECT id FROM users WHERE country = 'US'
);

-- The same result with a JOIN
SELECT o.id, o.amount
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.country = 'US';`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Derived tables</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A derived table is a subquery in the FROM clause. It acts like a temporary table that only exists for the duration of the query. You must give it an alias.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Top 10 users by order count, then join to get their email
SELECT u.email, order_stats.order_count
FROM users u
JOIN (
  SELECT user_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY user_id
  ORDER BY order_count DESC
  LIMIT 10
) AS order_stats ON u.id = order_stats.user_id;`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Derived tables let you apply GROUP BY, HAVING, or LIMIT before joining. The result of the inner query becomes a table you can join to and filter.
      </p>
    </section>
  );
}
