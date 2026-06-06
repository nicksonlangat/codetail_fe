export function CompositeIndexesSection() {
  return (
    <section>
      <h2 id="composite-indexes" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Composite Indexes
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A composite index covers multiple columns. The column order in the index definition determines which queries can use it. This is the most important thing to understand about composite indexes.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A B-tree index on (a, b, c) is sorted first by a, then by b within each a value, then by c within each b value. The index is useful for any query that filters on a prefix of that column sequence.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`CREATE INDEX idx_orders_user_status_date
  ON orders (user_id, status, created_at);

-- CAN use this index (filters on leading column)
WHERE user_id = 5
WHERE user_id = 5 AND status = 'completed'
WHERE user_id = 5 AND status = 'completed' AND created_at > '2024-01-01'

-- CANNOT use this index (skips the leading column)
WHERE status = 'completed'
WHERE created_at > '2024-01-01'
WHERE status = 'completed' AND created_at > '2024-01-01'`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Column order rules</h3>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "Equality columns first",
            detail: "= before ranges",
            desc: "Put columns used in equality filters (=, IN) before columns used in range filters (>, <, BETWEEN). A range condition breaks the sorted prefix — columns after it cannot be used from the index.",
          },
          {
            label: "Most selective column first",
            detail: "narrows the result fastest",
            desc: "Among equality columns, put the most selective one first. This minimizes the number of index entries the planner reads before filtering further. user_id before status if users are unique but statuses are few.",
          },
          {
            label: "Range column last among filters",
            detail: "can only use one range per index",
            desc: "WHERE a = 1 AND b > 5 AND c > 10: the index (a, b, c) can use a= and b>, but c> cannot be used from the index — you need a separate scan for it.",
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

      <h3 className="text-base font-semibold mt-8 mb-3">Covering indexes</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A covering index includes all the columns a query needs — both the filter columns and the SELECT columns. When an index covers a query, the database satisfies it entirely from the index without touching the table at all. This is called an index-only scan.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Query: find email for a given user_id
SELECT email FROM users WHERE id = 42;

-- Regular index on id: finds the row, then fetches email from the table
CREATE INDEX idx_users_id ON users (id);

-- Covering index: email is included, no table access needed
CREATE INDEX idx_users_id_covering ON users (id) INCLUDE (email);

-- PostgreSQL syntax uses INCLUDE for non-key columns
-- MySQL uses a composite index: (id, email) achieves the same effect`}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "Index-only scans are faster", desc: "No heap pointer lookups. The database reads the index pages only, which are smaller and more likely to be cached." },
          { label: "INCLUDE adds payload columns", desc: "PostgreSQL's INCLUDE adds columns to leaf nodes only — they cannot be used in WHERE but satisfy SELECT without a heap access." },
          { label: "Every index has a write cost", desc: "Each INSERT, UPDATE, or DELETE must update every index on the table. Too many indexes slow writes. Build indexes for your actual queries." },
          { label: "Indexes on foreign keys", desc: "Foreign key columns are almost always worth indexing. JOIN conditions and ON DELETE CASCADE checks scan them constantly." },
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
