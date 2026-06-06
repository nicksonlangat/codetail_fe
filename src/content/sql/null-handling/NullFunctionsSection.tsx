export function NullFunctionsSection() {
  return (
    <section>
      <h2 id="null-functions" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        COALESCE, NULLIF, and IS NULL
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Three tools make NULL predictable in practice. IS NULL tests for NULL correctly. COALESCE replaces NULL with a fallback. NULLIF converts a specific value back to NULL.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "IS NULL / IS NOT NULL",
            detail: "the only correct NULL test",
            desc: "The only operators that return TRUE or FALSE when the operand is NULL. IS NULL returns TRUE for NULL, FALSE for everything else. IS NOT NULL is the inverse. Never use = NULL or != NULL.",
          },
          {
            label: "COALESCE(a, b, c, ...)",
            detail: "return the first non-NULL value",
            desc: "Returns the first argument that is not NULL. If all arguments are NULL, returns NULL. Use it to substitute defaults, merge columns, or prevent NULL from propagating into expressions.",
          },
          {
            label: "NULLIF(a, b)",
            detail: "return NULL when two values are equal",
            desc: "Returns NULL if a equals b, otherwise returns a. The main use case is preventing division by zero by converting 0 to NULL, so the division returns NULL instead of an error.",
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

      <h3 className="text-base font-semibold mt-8 mb-3">COALESCE examples</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Show 'N/A' when phone is NULL
SELECT name, COALESCE(phone, 'N/A') AS phone
FROM users;

-- Use display_name if available, fall back to username
SELECT COALESCE(display_name, username) AS shown_name
FROM users;

-- Treat NULL score as 0 in arithmetic
SELECT name, COALESCE(score, 0) + bonus AS total
FROM players;

-- Average over all rows, treating NULL as 0
SELECT SUM(COALESCE(score, 0)) / COUNT(*) AS avg_including_nulls
FROM ratings;`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">NULLIF examples</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Division by zero: without NULLIF, this errors when total_users = 0
SELECT conversions / total_users AS rate
FROM funnel;

-- With NULLIF: returns NULL instead of error when total_users = 0
SELECT conversions / NULLIF(total_users, 0) AS rate
FROM funnel;

-- Treat empty string the same as NULL
SELECT NULLIF(notes, '') AS notes
FROM tickets;
-- Returns NULL when notes is '', so IS NULL checks work uniformly`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">NOT IN with NULL — the full picture</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The most dangerous NULL behavior in SQL. If any value in a NOT IN list is NULL, the entire condition returns no rows — not some rows, none.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- cancelled_by_ids contains: (3, 7, NULL)
-- This returns zero rows, even for users with id = 1 or id = 2
SELECT * FROM users
WHERE id NOT IN (SELECT cancelled_by FROM orders);

-- Why: id != NULL is UNKNOWN for every row
-- NOT IN requires all comparisons to be TRUE (not equal to anything in list)
-- UNKNOWN means the condition is not provably TRUE -> row excluded

-- Safe: NOT EXISTS handles NULL correctly
SELECT * FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.cancelled_by = u.id
);

-- Also safe: filter NULLs out of the subquery explicitly
SELECT * FROM users
WHERE id NOT IN (
  SELECT cancelled_by FROM orders WHERE cancelled_by IS NOT NULL
);`}
        </pre>
      </div>
    </section>
  );
}
