export function BTreeSection() {
  return (
    <section>
      <h2 id="btree" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        How B-Tree Indexes Work
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Without an index, finding rows that match a WHERE condition requires reading every row in the table — a sequential scan. On a million-row table, that means a million comparisons regardless of how many rows actually match.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A B-tree index is a separate data structure that keeps column values sorted and stores a pointer to each row's physical location. Finding a value in a sorted tree takes logarithmic time — a million rows requires roughly 20 comparisons instead of a million.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">The tree structure</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A B-tree has three levels: root, internal nodes, and leaf nodes. Each internal node holds a range of values and a pointer to the child node that covers that range. Leaf nodes hold the actual indexed values and row pointers (called heap pointers or TIDs).
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Create an index on users.email
CREATE INDEX idx_users_email ON users (email);

-- The database now maintains a sorted structure:
--
--        [M]
--       /   \
--    [D-L]  [N-Z]
--   /  |  \     \
-- [D] [E-H] [L] [N-Z]  <- leaf nodes with row pointers
--
-- Searching for email = 'kate@...' traverses root → right child → leaf
-- ~3 reads instead of a full table scan`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">When the planner uses an index</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The query planner chooses between a sequential scan and an index scan based on estimated cost. An index scan is not always faster — following heap pointers to random disk locations can be slower than reading the table sequentially if a large percentage of rows match.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "High selectivity",
            detail: "index scan likely",
            desc: "WHERE email = 'x@y.com' matches very few rows. The index quickly finds those rows and the planner uses it. Selectivity is the fraction of rows matched — lower is more selective.",
          },
          {
            label: "Low selectivity",
            detail: "sequential scan likely",
            desc: "WHERE status = 'active' might match 80% of rows. Reading 80% of rows via random heap pointer lookups is slower than a sequential scan. The planner skips the index.",
          },
          {
            label: "Small table",
            detail: "sequential scan likely",
            desc: "On a 500-row table, a sequential scan fits in a few pages and is faster than the overhead of a B-tree traversal. The planner often ignores indexes on small tables.",
          },
          {
            label: "LIKE with leading wildcard",
            detail: "index not usable",
            desc: "WHERE name LIKE '%smith' cannot use a B-tree index because the sorted order is by prefix, not suffix. WHERE name LIKE 'smith%' can use the index.",
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
