export function RecursiveCTEsSection() {
  return (
    <section>
      <h2 id="recursive-ctes" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Recursive CTEs
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A recursive CTE references itself. This lets you express queries that repeat a step until a condition is met — traversing a hierarchy, walking a graph, or generating a sequence.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The syntax adds <code>RECURSIVE</code> after WITH. The CTE body has two parts joined by UNION ALL: an anchor member that produces the starting rows, and a recursive member that references the CTE itself to produce the next rows.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`WITH RECURSIVE cte_name AS (
  -- Anchor: the starting rows (runs once)
  SELECT ...

  UNION ALL

  -- Recursive member: references cte_name
  -- Runs repeatedly until it returns no rows
  SELECT ... FROM cte_name WHERE ...
)
SELECT * FROM cte_name;`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Traversing a hierarchy</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The most common use case is a table where rows reference other rows in the same table — an org chart, a category tree, or a threaded comments system.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- employees(id, name, manager_id)
-- Find the full reporting chain under a given manager

WITH RECURSIVE org_chart AS (
  -- Anchor: start with the target manager
  SELECT id, name, manager_id, 0 AS depth
  FROM employees
  WHERE id = 5  -- starting employee

  UNION ALL

  -- Recursive: find direct reports of the current level
  SELECT e.id, e.name, e.manager_id, oc.depth + 1
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT name, depth
FROM org_chart
ORDER BY depth, name;`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The anchor selects employee 5. The recursive member joins employees to the current result, finding everyone who reports to a row already in the result. This repeats until no new rows are added.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Generating a sequence</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Recursive CTEs can generate rows that do not exist in any table. A common use is producing a date series to fill gaps in time-based reports.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Generate every date in January 2024
WITH RECURSIVE date_series AS (
  SELECT DATE '2024-01-01' AS d

  UNION ALL

  SELECT d + INTERVAL '1 day'
  FROM date_series
  WHERE d < DATE '2024-01-31'
)
SELECT d FROM date_series;

-- Use it to fill gaps: left join orders so days with no orders still appear
WITH RECURSIVE date_series AS (
  SELECT DATE '2024-01-01' AS d
  UNION ALL
  SELECT d + INTERVAL '1 day' FROM date_series WHERE d < DATE '2024-01-31'
)
SELECT ds.d, COALESCE(SUM(o.amount), 0) AS daily_revenue
FROM date_series ds
LEFT JOIN orders o ON DATE(o.created_at) = ds.d
GROUP BY ds.d
ORDER BY ds.d;`}
        </pre>
      </div>

      <div className="space-y-3 mb-6">
        {[
          {
            label: "Anchor runs once",
            detail: "produces the initial result set",
            desc: "The anchor member is a normal SELECT. Its output is the first version of the CTE result. The recursive member then takes over.",
          },
          {
            label: "Recursive member repeats until empty",
            detail: "each iteration adds new rows",
            desc: "The recursive member runs against the rows added in the previous iteration. When it produces zero new rows, the recursion stops.",
          },
          {
            label: "UNION ALL vs UNION",
            detail: "UNION ALL is almost always correct",
            desc: "UNION removes duplicates, which adds overhead and can prematurely stop recursion if two levels produce the same row. Use UNION ALL unless you specifically need deduplication.",
          },
          {
            label: "Add a depth limit",
            detail: "prevents infinite loops",
            desc: "If the data has a cycle (row A's parent is row B, row B's parent is row A), the recursion loops forever. Track depth and add WHERE depth < 100 as a safeguard.",
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
