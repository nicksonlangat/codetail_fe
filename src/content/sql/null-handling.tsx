import { ThreeValuedLogicSection } from "./null-handling/ThreeValuedLogicSection";
import { NullInExpressionsSection } from "./null-handling/NullInExpressionsSection";
import { NullFunctionsSection } from "./null-handling/NullFunctionsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "three-valued-logic", title: "Three-Valued Logic" },
  { id: "null-in-expressions", title: "NULL in Expressions and Aggregates" },
  { id: "null-functions", title: "COALESCE, NULLIF, and IS NULL" },
  { id: "summary", title: "Summary" },
];

export default function NullHandlingArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          NULL is the most misunderstood value in SQL. It is not zero, not an empty string, and not false. It means unknown — the value is absent or not applicable. That single distinction changes how every comparison, expression, and aggregate behaves.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          SQL does not use two-valued logic. It uses three: TRUE, FALSE, and UNKNOWN. NULL produces UNKNOWN in any comparison. WHERE drops UNKNOWN rows the same way it drops FALSE rows. That is why <code>WHERE email = NULL</code> never returns anything, even when NULL values exist.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          By the end of this article you will understand how UNKNOWN propagates through AND and OR, why NULL defeats NOT IN, and how COALESCE and NULLIF give you predictable control over NULL in real queries.
        </p>
      </section>

      <ThreeValuedLogicSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <NullInExpressionsSection />
      <NullFunctionsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🕳️", label: "NULL means unknown, not false or zero", desc: "NULL is the absence of a value. It is not equal to anything, including itself. Any comparison with NULL produces UNKNOWN, not TRUE or FALSE." },
            { icon: "🔢", label: "SQL has three truth values", desc: "TRUE, FALSE, and UNKNOWN. WHERE keeps only TRUE rows. UNKNOWN rows are excluded — just like FALSE rows. This is why NULL filters silently return nothing." },
            { icon: "✅", label: "IS NULL is the only correct NULL test", desc: "WHERE col = NULL never returns rows. IS NULL and IS NOT NULL are the only operators that return a boolean when the operand is NULL." },
            { icon: "🔁", label: "NULL propagates through expressions", desc: "Any arithmetic or string expression with a NULL operand returns NULL. Use COALESCE to substitute a default before the expression runs." },
            { icon: "🛡️", label: "COALESCE returns the first non-NULL value", desc: "COALESCE(a, b, c) returns a if it is not NULL, otherwise b, otherwise c. Use it to provide defaults, merge columns, and prevent NULL from breaking calculations." },
            { icon: "⚠️", label: "NOT IN with NULLs returns zero rows", desc: "If any value in a NOT IN subquery is NULL, the entire condition produces UNKNOWN for every row. Use NOT EXISTS or filter NULLs out of the subquery with IS NOT NULL." },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <div>
                <p className="text-[13px] font-semibold mb-0.5">{label}</p>
                <p className="text-[12px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
