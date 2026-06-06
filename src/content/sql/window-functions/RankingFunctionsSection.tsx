export function RankingFunctionsSection() {
  return (
    <section>
      <h2 id="ranking-functions" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Ranking Functions
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Ranking functions assign a position number to each row based on its order within the window. They all require ORDER BY inside OVER. The difference between them is how they handle ties.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "ROW_NUMBER",
            detail: "unique sequential integer, no ties",
            desc: "Assigns 1, 2, 3, ... to every row in the window. When two rows have the same ORDER BY value, they still get different numbers. The assignment is arbitrary but deterministic within a query run.",
          },
          {
            label: "RANK",
            detail: "tied rows share a rank, gaps after ties",
            desc: "Tied rows receive the same rank. The next rank after the tie skips numbers equal to the size of the tie. Two rows tied at rank 1 means the next row is rank 3, not 2.",
          },
          {
            label: "DENSE_RANK",
            detail: "tied rows share a rank, no gaps",
            desc: "Like RANK, tied rows receive the same rank. Unlike RANK, the next rank after the tie is always the next consecutive number. Two rows tied at rank 1 means the next row is rank 2.",
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

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`SELECT
  name,
  score,
  ROW_NUMBER() OVER (ORDER BY score DESC) AS row_num,
  RANK()       OVER (ORDER BY score DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank
FROM leaderboard;

-- name   score  row_num  rank  dense_rank
-- Alice  100    1        1     1
-- Bob    100    2        1     1
-- Carol  90     3        3     2   <- RANK skips 2, DENSE_RANK does not
-- Dave   80     4        4     3`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Getting the top N per group</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A common pattern is ranking rows within a partition and then filtering to keep only the top N. You cannot use a window function directly in WHERE, so wrap it in a CTE or subquery first.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Top 3 orders by amount per country
WITH ranked AS (
  SELECT
    id,
    country,
    amount,
    ROW_NUMBER() OVER (PARTITION BY country ORDER BY amount DESC) AS rn
  FROM orders
)
SELECT id, country, amount
FROM ranked
WHERE rn <= 3;`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90">
        Use ROW_NUMBER when you want exactly N rows per group. Use RANK or DENSE_RANK when ties should count — for example, returning everyone with a top-3 score even if that means returning 4 rows.
      </p>
    </section>
  );
}
