export function WhyIndexesSection() {
  return (
    <section>
      <h2 id="why-indexes" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        The Problem: Full Table Scans
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Without an index, a database has no choice but to read every row in a table to find
        the ones that match your query. This is a full table scan. On a table with a million
        rows, every query that lacks an index reads a million rows, even if the result is a
        single record.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Without an index: every query is O(n)
        </p>
        <pre className="text-[10px] font-mono text-foreground/80 leading-relaxed whitespace-pre">{`-- Table: users (1,000,000 rows)
-- Query: find a user by email

SELECT * FROM users WHERE email = 'alice@example.com';

-- What happens internally:
-- Row 1:  email = 'bob@...'      → skip
-- Row 2:  email = 'carol@...'    → skip
-- ...
-- Row 847,291: email = 'alice@...' → match!
-- Row 847,292 ... 1,000,000       → still have to check

-- Total rows read: 1,000,000
-- Time: ~200ms on a warm SSD`}</pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        An index is a separate data structure maintained alongside your table. It stores
        a sorted copy of the indexed column(s) along with pointers to the actual rows.
        Instead of scanning the table, the database searches the index, finds the pointer,
        and jumps directly to the matching row. The same query drops from O(n) to O(log n).
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          With an index: O(log n) lookup
        </p>
        <pre className="text-[10px] font-mono text-foreground/80 leading-relaxed whitespace-pre">{`-- Create the index once
CREATE INDEX idx_users_email ON users(email);

-- Same query, now uses the index
SELECT * FROM users WHERE email = 'alice@example.com';

-- What happens internally:
-- B-tree root: 'alice' < 'mike', go left
-- Next node:   'alice' > 'adam', go right
-- Next node:   'alice' found → row pointer: #847291
-- Heap fetch:  read row #847291 directly

-- Total rows read: 1
-- Comparisons: ~20 (log2 of 1M)
-- Time: <1ms`}</pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The cost of indexes</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Indexes are not free. Every index you add must be maintained by the database on
        every INSERT, UPDATE, and DELETE. For read-heavy workloads, this is a good trade.
        For write-heavy workloads, excessive indexing becomes the bottleneck.
      </p>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {[
          {
            icon: "📖",
            label: "Reads",
            impact: "Dramatically faster",
            detail: "O(log n) instead of O(n). 1ms instead of 200ms on a million-row table.",
            positive: true,
          },
          {
            icon: "✍️",
            label: "Writes",
            impact: "Slightly slower",
            detail: "Every insert, update, or delete must update the index B-tree. Cost scales with number of indexes.",
            positive: false,
          },
          {
            icon: "💾",
            label: "Storage",
            impact: "Extra disk used",
            detail: "A B-tree index on a large table can consume gigabytes. Monitor total index size vs table size.",
            positive: false,
          },
        ].map(({ icon, label, impact, detail, positive }) => (
          <div key={label} className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <span>{icon}</span>
              <span className="text-[12px] font-semibold">{label}</span>
              <span className={`ml-auto text-[9px] font-medium px-1.5 py-0.5 rounded ${
                positive ? "bg-primary/10 text-primary" : "bg-orange-400/10 text-orange-500"
              }`}>
                {impact}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{detail}</p>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          Rule of thumb: index columns that appear in WHERE, JOIN ON, and ORDER BY clauses.
          Do not index every column. A table with 20 indexes and heavy write traffic will
          be slower than one with 5 well-chosen indexes.
        </p>
      </div>
    </section>
  );
}
