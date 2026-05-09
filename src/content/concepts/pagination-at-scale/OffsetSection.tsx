export function OffsetSection() {
  return (
    <section>
      <h2 id="offset" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        The Problem with OFFSET
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        OFFSET-based pagination is the default approach: skip N rows, return the next
        page. It maps naturally to page numbers in a UI and is trivial to implement.
        It also has two fundamental problems that compound at scale.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Problem 1: OFFSET is O(n)</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        SQL OFFSET does not skip rows efficiently. The database must scan through all
        preceding rows before returning the requested page. OFFSET 10000 LIMIT 20 does
        not read 20 rows — it reads 10,020 rows and discards the first 10,000.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Page 1: fast. Reads 20 rows.
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 0;

-- Page 10: reads 200 rows, discards 180.
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 180;

-- Page 500: reads 10,020 rows, discards 10,000.
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 9980;

-- Each page deeper costs progressively more.
-- An index on created_at helps, but does not eliminate the scan.`}
        </pre>
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-6 text-muted-foreground font-medium">Page</th>
              <th className="text-left py-2 pr-6 text-muted-foreground font-medium">OFFSET</th>
              <th className="text-left py-2 pr-6 text-muted-foreground font-medium">Rows scanned</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Rows returned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {[
              { page: 1, offset: 0, scanned: 20, returned: 20 },
              { page: 10, offset: 180, scanned: 200, returned: 20 },
              { page: 100, offset: 1980, scanned: 2000, returned: 20 },
              { page: 500, offset: 9980, scanned: 10000, returned: 20 },
              { page: 5000, offset: 99980, scanned: 100000, returned: 20 },
            ].map(({ page, offset, scanned, returned }) => (
              <tr key={page}>
                <td className="py-2 pr-6 font-mono text-foreground/80">{page}</td>
                <td className="py-2 pr-6 font-mono text-muted-foreground">{offset.toLocaleString()}</td>
                <td className={`py-2 pr-6 font-mono ${scanned > 1000 ? "text-destructive" : "text-muted-foreground"}`}>
                  {scanned.toLocaleString()}
                </td>
                <td className="py-2 font-mono text-muted-foreground">{returned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Problem 2: Results shift under live data</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Offset pagination assumes the dataset is static. In a live application, rows
        are inserted and deleted between page requests. New rows push existing rows to
        different offsets.
      </p>

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-2.5 border-b border-border bg-muted/30">
          <p className="text-[11px] font-semibold">Item duplication during pagination</p>
        </div>
        <div className="px-4 py-4 space-y-2 text-[11px]">
          {[
            { text: "User loads page 1: items 1–20 (newest first). Item 20 is at the bottom.", bad: false },
            { text: "New item is posted. It becomes the new item 1.", bad: false },
            { text: "User loads page 2 with OFFSET 20.", bad: false },
            { text: "Item 20 (which was last on page 1) is now at position 21. It appears at the top of page 2 again.", bad: true },
          ].map(({ text, bad }, i) => (
            <div key={i} className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-secondary text-muted-foreground text-[9px] font-bold flex-shrink-0 flex items-center justify-center">
                {i + 1}
              </span>
              <p className={`mt-0.5 ${bad ? "text-destructive" : "text-muted-foreground"}`}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">When offset pagination is acceptable</h3>

      <div className="space-y-2">
        {[
          { condition: "Small datasets where page depth is bounded", desc: "An admin panel that shows 500 rows total will never reach OFFSET 10000. The O(n) cost is negligible." },
          { condition: "Static or rarely-changing data", desc: "A documentation site with numbered pages does not have live inserts. The shifting-results problem does not apply." },
          { condition: "Users never paginate past page 5", desc: "In practice, 99% of users never go beyond the first few pages of search results. The deep-pagination cost is theoretical for most UIs." },
        ].map(({ condition, desc }) => (
          <div key={condition} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{condition}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
