import { BTreeExplorer } from "@/components/blog/interactive/btree-explorer";

export function BTreeSection() {
  return (
    <section>
      <h2 id="btree-indexes" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        How B-tree Indexes Work
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The default index type in PostgreSQL, MySQL, and most other relational databases
        is a B-tree (balanced tree). The B-tree is a self-balancing sorted tree that keeps
        all leaf nodes at the same depth. This guarantees that any lookup takes exactly
        O(log n) comparisons, regardless of which key you are searching for.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-6">
        The visualizer below uses a 16-row table. Select a search target, then click
        &quot;Run comparison&quot; to see a full table scan and a B-tree lookup side by side.
        Notice that the scan checks rows one by one while the index descends the tree
        in exactly 4 comparisons, regardless of which value you search for.
      </p>

      <BTreeExplorer />

      <h3 className="text-base font-semibold text-brand-text mt-4 mb-3">B-tree properties</h3>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          {
            label: "Balanced height",
            desc: "All paths from root to leaf have the same length. A table with 1 billion rows has a B-tree height of roughly 30. Every lookup takes at most 30 comparisons.",
          },
          {
            label: "Sorted order",
            desc: "Keys in every node are sorted. This makes range queries efficient: find the start key via binary search, then scan leaves sequentially.",
          },
          {
            label: "High branching factor",
            desc: "Real B-trees (B+ trees) store hundreds of keys per node, not just two children. A tree with 1B rows might be only 3-4 levels deep.",
          },
          {
            label: "Leaf chaining",
            desc: "Leaf nodes are linked in sorted order. Range scans (WHERE age BETWEEN 20 AND 30) traverse the chain without backtracking to the root.",
          },
        ].map(({ label, desc }) => (
          <div key={label} className="p-4 rounded-xl border border-brand-border bg-white">
            <p className="text-[12px] font-semibold text-brand-text mb-1">{label}</p>
            <p className="text-[11px] text-brand-text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">O(log n) in practice</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono border-collapse">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left py-1.5 pr-4 text-brand-text-muted font-medium">Table rows</th>
                <th className="text-left py-1.5 pr-4 text-brand-text-muted font-medium">Full scan</th>
                <th className="text-left py-1.5 text-brand-text-muted font-medium">B-tree depth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {[
                { rows: "1,000", scan: "1,000 reads", depth: "~10 levels" },
                { rows: "100,000", scan: "100,000 reads", depth: "~17 levels" },
                { rows: "1,000,000", scan: "1,000,000 reads", depth: "~20 levels" },
                { rows: "1,000,000,000", scan: "1,000,000,000 reads", depth: "~30 levels" },
              ].map(({ rows, scan, depth }) => (
                <tr key={rows}>
                  <td className="py-1.5 pr-4 text-brand-text/80 font-semibold">{rows}</td>
                  <td className="py-1.5 pr-4 text-brand-warning">{scan}</td>
                  <td className="py-1.5 text-brand-primary">{depth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[9px] text-brand-text-subtle mt-2">
          Real B+ trees with branching factor of 100-200 are even shallower. Most production
          tables are reachable in 3-5 levels regardless of size.
        </p>
      </div>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          B-trees work well for equality lookups (WHERE id = 42), range queries
          (WHERE created_at BETWEEN ...), and ORDER BY on indexed columns. They do not help
          with wildcard prefix searches (WHERE name LIKE &apos;%smith&apos;) or full-text matching.
          Use a dedicated full-text index (tsvector, Elasticsearch) for those.
        </p>
      </div>
    </section>
  );
}
