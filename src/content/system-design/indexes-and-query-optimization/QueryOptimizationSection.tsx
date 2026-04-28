const BAD_PATTERNS = [
  {
    name: "The N+1 query problem",
    icon: "🔁",
    bad: `# Django ORM — looks clean, performs terribly
posts = Post.objects.all()       # 1 query
for post in posts:
    # Each iteration fires a NEW query!
    author = post.author          # N queries
    comments = post.comments.all() # N more queries

# For 100 posts: 201 queries sent to the database`,
    good: `# Use eager loading to fetch in bulk
posts = Post.objects.select_related('author') \\
            .prefetch_related('comments') \\
            .all()

# Now: exactly 3 queries total, regardless of post count:
# 1. SELECT posts
# 2. SELECT authors WHERE id IN (...)
# 3. SELECT comments WHERE post_id IN (...)`,
    note: "The N+1 pattern is the most common cause of slow pages in ORM-based applications. Enable query logging in development to catch it early.",
  },
  {
    name: "Function on indexed column",
    icon: "🔧",
    bad: `-- Index on created_at exists, but this doesn't use it:
SELECT * FROM orders
WHERE YEAR(created_at) = 2025;

-- Or in PostgreSQL:
WHERE DATE_TRUNC('year', created_at) = '2025-01-01';

-- The function wraps the column, breaking the index.
-- Database falls back to full scan.`,
    good: `-- Rewrite to a range query on the raw column:
SELECT * FROM orders
WHERE created_at >= '2025-01-01'
  AND created_at <  '2026-01-01';

-- Now the B-tree index on created_at is used.
-- Alternative: create an expression index
CREATE INDEX idx_year ON orders (YEAR(created_at));`,
    note: "If you must apply a function, create an expression index that stores the pre-computed result.",
  },
  {
    name: "Wildcard prefix search",
    icon: "🔍",
    bad: `-- Index on name exists, but this causes a full scan:
SELECT * FROM users WHERE name LIKE '%smith';

-- The leading wildcard prevents the B-tree from
-- knowing where to start. Every row must be checked.`,
    good: `-- Trailing wildcard works (prefix search):
SELECT * FROM users WHERE name LIKE 'smith%';

-- For full-text search, use the right tool:
-- PostgreSQL: tsvector + GIN index
-- MySQL: FULLTEXT index
-- Or: Elasticsearch for advanced text search`,
    note: "B-trees are sorted by value from left to right. A leading wildcard means 'start could be anywhere', making the sorted order useless.",
  },
];

export function QueryOptimizationSection() {
  return (
    <section>
      <h2 id="query-optimization" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Query Optimization and Common Pitfalls
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Even with indexes in place, queries can be slow if they are written in ways the
        database cannot optimize. The most common culprits are the N+1 problem, functions
        applied to indexed columns, and access patterns that invalidate the index entirely.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Reading EXPLAIN output</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Every major database has an EXPLAIN command that shows how a query will be executed.
        Reading EXPLAIN output is the fastest way to understand why a query is slow.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-8 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          PostgreSQL EXPLAIN ANALYZE output
        </p>
        <pre className="text-[10px] font-mono text-foreground/80 leading-relaxed whitespace-pre overflow-x-auto">{`EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42;

-- Without index:
Seq Scan on orders  (cost=0.00..18334.00 rows=1 width=52)
                    (actual time=128.3..128.3 rows=1 loops=1)
  Filter: (customer_id = 42)
  Rows Removed by Filter: 999999        ← scanned 1M rows!
Planning Time: 0.1 ms
Execution Time: 128.4 ms

-- After: CREATE INDEX idx_orders_customer ON orders(customer_id);

Index Scan on orders using idx_orders_customer
                    (cost=0.42..8.44 rows=1 width=52)
                    (actual time=0.04..0.04 rows=1 loops=1)
  Index Cond: (customer_id = 42)
Planning Time: 0.1 ms
Execution Time: 0.05 ms            ← 2,500x faster`}</pre>
        <div className="mt-3 grid sm:grid-cols-3 gap-2 text-[10px]">
          {[
            { key: "Seq Scan", meaning: "Full table scan. Look for this when performance is bad." },
            { key: "Index Scan", meaning: "B-tree lookup. Usually what you want." },
            { key: "Index Only Scan", meaning: "Covering index hit. Best case: no heap fetch." },
          ].map(({ key, meaning }) => (
            <div key={key} className="p-2 rounded-lg bg-muted">
              <span className="font-mono font-semibold text-primary">{key}</span>
              <p className="text-muted-foreground mt-0.5">{meaning}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Common slow query patterns</h3>

      <div className="space-y-4">
        {BAD_PATTERNS.map(({ name, icon, bad, good, note }) => (
          <div key={name} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 bg-secondary/50 border-b border-border flex items-center gap-2">
              <span>{icon}</span>
              <span className="text-[13px] font-semibold">{name}</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-destructive/70 font-medium mb-1.5">Problematic</p>
                  <pre className="text-[9px] font-mono bg-muted rounded-lg px-3 py-2.5 overflow-x-auto whitespace-pre leading-relaxed text-foreground/70">
                    {bad}
                  </pre>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-primary/70 font-medium mb-1.5">Fixed</p>
                  <pre className="text-[9px] font-mono bg-muted rounded-lg px-3 py-2.5 overflow-x-auto whitespace-pre leading-relaxed text-foreground/70">
                    {good}
                  </pre>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/70 italic border-t border-border/50 pt-2">{note}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">When not to add an index</h3>

      <div className="grid gap-2 sm:grid-cols-2 mt-4">
        {[
          { label: "Low cardinality columns", desc: "A boolean column has only 2 values. An index on it often makes things worse: the database reads half the table and then fetches each row anyway." },
          { label: "Small tables", desc: "For tables under a few thousand rows, a sequential scan is faster than an index lookup. The overhead of the index traversal exceeds the benefit." },
          { label: "Write-heavy tables", desc: "Every write must update all indexes. An event log or audit table with 20 indexes will be throttled by index maintenance, not by the data itself." },
          { label: "Columns rarely in WHERE", desc: "Index only columns your queries actually filter on. An index that is never used still costs write overhead and storage." },
        ].map(({ label, desc }) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-orange-500 font-bold text-sm flex-shrink-0 mt-0.5">–</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{label}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
