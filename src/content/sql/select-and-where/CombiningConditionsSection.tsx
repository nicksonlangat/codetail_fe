export function CombiningConditionsSection() {
  return (
    <section>
      <h2 id="combining-conditions" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Combining Conditions
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Real queries rarely filter on a single condition. AND, OR, and NOT let you combine conditions to express more specific filters.
      </p>

      <div className="space-y-3 mb-8">
        {[
          { label: "AND", detail: "both must be TRUE", desc: "WHERE status = 'active' AND age > 18 keeps only rows where both conditions are true. If either is false, the row is excluded." },
          { label: "OR", detail: "either must be TRUE", desc: "WHERE country = 'US' OR country = 'CA' keeps rows matching either condition. A row only needs one condition to be true." },
          { label: "NOT", detail: "inverts the condition", desc: "WHERE NOT status = 'banned' is equivalent to WHERE status != 'banned'. NOT is more useful with IN: WHERE NOT country IN ('US', 'CA')." },
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

      <h3 className="text-base font-semibold mt-8 mb-3">Operator precedence</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        AND binds tighter than OR. This means SQL evaluates AND conditions first, before OR. Without parentheses, a mixed expression can produce surprising results.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Without parentheses: AND runs first
-- This reads as: status='active' OR (role='admin' AND country='US')
SELECT * FROM users
WHERE status = 'active'
   OR role = 'admin'
  AND country = 'US';

-- With parentheses: explicit grouping
-- This reads as: (status='active' OR role='admin') AND country='US'
SELECT * FROM users
WHERE (status = 'active' OR role = 'admin')
  AND country = 'US';`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Use parentheses any time you mix AND and OR. It costs nothing and removes all ambiguity.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Practical example</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        This query finds active users in North America who signed up in 2024 and have a verified email.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`SELECT id, email, country, created_at
FROM users
WHERE status = 'active'
  AND country IN ('US', 'CA', 'MX')
  AND created_at >= '2024-01-01'
  AND email_verified IS NOT NULL;`}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {[
          { label: "Use parentheses", desc: "Always add parentheses when mixing AND and OR. The precedence rules are easy to forget." },
          { label: "AND narrows results", desc: "Each AND condition you add reduces the number of rows returned." },
          { label: "OR broadens results", desc: "Each OR condition you add increases the number of rows returned." },
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
