export function NullInExpressionsSection() {
  return (
    <section>
      <h2 id="null-in-expressions" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        NULL in Expressions and Aggregates
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        NULL propagates through arithmetic and string operations. Any expression that includes a NULL operand produces NULL. This includes addition, subtraction, multiplication, and string concatenation.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Arithmetic with NULL produces NULL
SELECT 100 + NULL;       -- NULL
SELECT NULL * 0;         -- NULL, not 0
SELECT NULL / NULL;      -- NULL

-- String concatenation with NULL produces NULL (in most databases)
SELECT 'Hello, ' || NULL || '!';   -- NULL in PostgreSQL
SELECT CONCAT('Hello, ', NULL);    -- 'Hello, ' in MySQL (CONCAT ignores NULLs)

-- Comparisons with NULL produce UNKNOWN
SELECT NULL = NULL;      -- UNKNOWN (not TRUE)
SELECT NULL != NULL;     -- UNKNOWN (not FALSE)
SELECT NULL > 0;         -- UNKNOWN`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">NULL in aggregate functions</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Aggregate functions ignore NULL values. COUNT(column) skips NULLs. SUM, AVG, MIN, and MAX all exclude NULL rows from their computation. This is usually the right behavior — but it means your counts and averages are over non-NULL rows only.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Table: ratings(user_id, score)
-- 10 rows: 7 have a score, 3 have NULL

SELECT
  COUNT(*)     AS total_rows,   -- 10 (counts everything)
  COUNT(score) AS scored_rows,  -- 7  (skips NULLs)
  AVG(score)   AS avg_score,    -- average of the 7 non-NULL scores
  SUM(score)   AS total_score   -- sum of the 7 non-NULL scores
FROM ratings;

-- AVG(score) is NOT the same as SUM(score) / COUNT(*)
-- AVG(score) divides by 7 (non-NULL count)
-- SUM(score) / COUNT(*) divides by 10 (total rows)`}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "NULL propagates in arithmetic", desc: "Any arithmetic expression with a NULL operand returns NULL. Use COALESCE to substitute a default before computing." },
          { label: "Aggregates skip NULLs silently", desc: "COUNT(col), SUM, AVG all exclude NULL rows. Your averages and counts are over the non-NULL subset unless you account for this explicitly." },
          { label: "AVG denominator excludes NULLs", desc: "AVG(score) divides by the count of non-NULL scores. If you want the average over all rows (treating NULL as zero), use SUM(COALESCE(score, 0)) / COUNT(*)." },
          { label: "MySQL CONCAT ignores NULLs", desc: "MySQL's CONCAT() treats NULL arguments as empty strings. PostgreSQL's || operator propagates NULL. Know your database." },
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
