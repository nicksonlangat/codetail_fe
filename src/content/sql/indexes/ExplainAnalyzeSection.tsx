export function ExplainAnalyzeSection() {
  return (
    <section>
      <h2 id="explain-analyze" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Reading EXPLAIN ANALYZE
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        EXPLAIN shows what the query planner intends to do. EXPLAIN ANALYZE actually runs the query and shows what happened, including real row counts and timing. Use ANALYZE when you need to understand why a query is slow.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`EXPLAIN ANALYZE
SELECT id, email FROM users WHERE id = 42;

-- Output:
-- Index Scan using users_pkey on users
--   (cost=0.29..8.31 rows=1 width=36)
--   (actual time=0.018..0.019 rows=1 loops=1)
--   Index Cond: (id = 42)
-- Planning Time: 0.08 ms
-- Execution Time: 0.04 ms`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Reading the output</h3>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "Node type",
            detail: "what operation was performed",
            desc: "Seq Scan = read every row. Index Scan = traverse index then fetch rows. Index Only Scan = satisfied entirely from the index. Bitmap Heap Scan = used index to build a bitmap, then fetched matching rows in one pass.",
          },
          {
            label: "cost=X..Y",
            detail: "planner's estimated cost in arbitrary units",
            desc: "X is the startup cost before the first row is returned. Y is the total cost to return all rows. These are relative — compare nodes within a plan, not across different databases.",
          },
          {
            label: "rows=N",
            detail: "estimated vs actual row count",
            desc: "The planner estimates rows using table statistics. When estimated rows differ wildly from actual rows, the planner may have chosen a suboptimal plan. Run ANALYZE to update statistics.",
          },
          {
            label: "actual time=X..Y",
            detail: "real wall-clock milliseconds",
            desc: "X is time to return the first row, Y is total time. These multiply by loops — if loops=1000 and time=0.01ms, the node actually cost 10ms total.",
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

      <h3 className="text-base font-semibold mt-8 mb-3">Common slow query patterns</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Pattern 1: function on indexed column prevents index use
-- BAD: wrapping the column in a function defeats the index
WHERE LOWER(email) = 'alice@example.com'

-- GOOD: use a functional index or restructure
CREATE INDEX idx_users_email_lower ON users (LOWER(email));

-- Pattern 2: implicit type cast defeats index
-- BAD: user_id is integer, but '42' is a string — cast prevents index
WHERE user_id = '42'

-- GOOD: match the column type
WHERE user_id = 42

-- Pattern 3: OR across columns cannot use a single index
-- BAD: requires two separate index scans
WHERE first_name = 'Alice' OR last_name = 'Alice'

-- GOOD: two indexes + UNION, or a separate search column
SELECT * FROM users WHERE first_name = 'Alice'
UNION
SELECT * FROM users WHERE last_name = 'Alice';`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When you see a Seq Scan on a large table in EXPLAIN ANALYZE and expect an index scan, check these three patterns first. They account for the majority of cases where a valid index is present but not used.
      </p>
    </section>
  );
}
