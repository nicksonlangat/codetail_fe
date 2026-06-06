export function WhereClauseSection() {
  return (
    <section>
      <h2 id="where-clause" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        The WHERE Clause
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        WHERE filters rows. SQL evaluates the WHERE condition for every row in the table. Rows where the condition is TRUE are kept. Rows where it is FALSE or UNKNOWN are dropped.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        That distinction between FALSE and UNKNOWN matters. NULL produces UNKNOWN, not FALSE. This is why <code>WHERE email = NULL</code> never returns rows, even when NULL values exist.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Comparison operators</h3>

      <div className="space-y-3 mb-8">
        {[
          { label: "= and !=", detail: "equality / inequality", desc: "WHERE status = 'active' keeps rows where status is exactly 'active'. WHERE status != 'banned' excludes that value. These are case-sensitive on most databases." },
          { label: "< > <= >=", detail: "numeric and date ranges", desc: "WHERE age > 18 keeps rows where age is greater than 18. Works on numbers, dates, and strings (alphabetical order for strings)." },
          { label: "LIKE", detail: "pattern matching", desc: "% matches any sequence of characters (including none). _ matches exactly one character. WHERE name LIKE 'A%' matches any name starting with A." },
          { label: "IN", detail: "match any value in a list", desc: "WHERE country IN ('US', 'CA', 'UK') is shorthand for three OR conditions. Cleaner and faster to write when matching more than two values." },
          { label: "BETWEEN", detail: "inclusive range", desc: "WHERE age BETWEEN 18 AND 65 keeps rows where age is 18, 65, or any value between them. Both endpoints are included." },
          { label: "IS NULL / IS NOT NULL", detail: "null checks", desc: "The only correct way to test for NULL. WHERE email = NULL never matches anything because NULL is not equal to itself or any other value." },
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

      <h3 className="text-base font-semibold mt-8 mb-3">Examples</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Equality and inequality
SELECT * FROM users WHERE status = 'active';
SELECT * FROM users WHERE role != 'admin';

-- Comparison operators
SELECT * FROM orders WHERE amount > 100;
SELECT * FROM events WHERE created_at >= '2024-01-01';

-- Pattern matching with LIKE
SELECT * FROM users WHERE name LIKE 'A%';
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM products WHERE code LIKE 'SKU_001';

-- IN for multiple values
SELECT * FROM users WHERE country IN ('US', 'CA', 'UK');

-- BETWEEN for ranges (inclusive)
SELECT * FROM users WHERE age BETWEEN 18 AND 65;

-- NULL checks
SELECT * FROM users WHERE phone IS NULL;
SELECT * FROM users WHERE email IS NOT NULL;`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Three-valued logic is a core part of SQL. Any comparison involving NULL produces UNKNOWN rather than TRUE or FALSE. Since WHERE only keeps TRUE rows, UNKNOWN rows are always excluded.
      </p>
    </section>
  );
}
