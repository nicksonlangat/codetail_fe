export function ThreeValuedLogicSection() {
  return (
    <section>
      <h2 id="three-valued-logic" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Three-Valued Logic
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        NULL does not mean zero, empty string, or false. It means unknown — the value is absent or not applicable. This distinction matters because SQL does not use simple true/false logic. It uses three values: TRUE, FALSE, and UNKNOWN.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Any comparison involving NULL produces UNKNOWN. Not FALSE — UNKNOWN. WHERE only keeps rows where the condition is TRUE. UNKNOWN rows are dropped, the same as FALSE rows.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- These never return rows, even when NULL values exist
WHERE phone = NULL        -- NULL = NULL is UNKNOWN, not TRUE
WHERE phone != NULL       -- NULL != NULL is UNKNOWN, not TRUE
WHERE phone = ''          -- empty string is not NULL

-- The only correct way to test for NULL
WHERE phone IS NULL       -- TRUE for NULL rows
WHERE phone IS NOT NULL   -- TRUE for non-NULL rows`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">NULL in AND and OR</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        UNKNOWN propagates through boolean expressions in ways that can surprise you. The rules: UNKNOWN AND FALSE is FALSE, UNKNOWN AND TRUE is UNKNOWN, UNKNOWN OR TRUE is TRUE, UNKNOWN OR FALSE is UNKNOWN.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- phone IS NULL for these rows
-- status = 'active' for the first row, 'inactive' for the second

-- Row 1: UNKNOWN AND TRUE  = UNKNOWN -> row excluded
WHERE phone = '555' AND status = 'active'

-- Row 2: UNKNOWN AND FALSE = FALSE   -> row excluded
WHERE phone = '555' AND status = 'inactive'

-- Row 1: UNKNOWN OR TRUE   = TRUE    -> row included
WHERE phone = '555' OR status = 'active'

-- Row 2: UNKNOWN OR FALSE  = UNKNOWN -> row excluded
WHERE phone = '555' OR status = 'inactive'`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">NULL in JOINs</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        JOIN conditions use the same three-valued logic. If either side of the ON condition is NULL, the comparison is UNKNOWN and the rows do not join. Two rows with NULL in the join column are never matched to each other.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- orders with a NULL user_id do not join to any user row
SELECT o.id, u.email
FROM orders o
JOIN users u ON o.user_id = u.id;
-- Orders where user_id IS NULL are simply absent from the result

-- To see them, use LEFT JOIN and check for the NULL
SELECT o.id, u.email
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;
-- Orders with NULL user_id appear with NULL in all user columns`}
        </pre>
      </div>
    </section>
  );
}
