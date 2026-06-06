import { NonCorrelatedSection } from "./subqueries/NonCorrelatedSection";
import { CorrelatedSection } from "./subqueries/CorrelatedSection";
import { WhenToUseSection } from "./subqueries/WhenToUseSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "non-correlated", title: "Non-Correlated Subqueries" },
  { id: "correlated", title: "Correlated Subqueries" },
  { id: "when-to-use", title: "IN vs EXISTS vs JOIN" },
  { id: "summary", title: "Summary" },
];

export default function SubqueriesArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A subquery is a query nested inside another query. It lets you use the result of one SELECT as an input to another, without creating a temporary table or running two separate queries.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The key distinction is between non-correlated and correlated subqueries. A non-correlated subquery runs once. A correlated subquery references the outer query and runs once per row. That difference has real performance consequences.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          By the end of this article you will know the three places subqueries appear (SELECT, WHERE, FROM), how EXISTS differs from IN, and the NULL trap that makes NOT IN silently return zero rows.
        </p>
      </section>

      <NonCorrelatedSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <CorrelatedSection />
      <WhenToUseSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🪆", label: "Subqueries nest queries inside queries", desc: "A subquery appears in SELECT (scalar), WHERE (IN, EXISTS, comparison), or FROM (derived table). Each placement has different rules for what it can return." },
            { icon: "1️⃣", label: "Non-correlated subqueries run once", desc: "They do not reference the outer query, so the database executes them once and reuses the result. Scalar subqueries must return exactly one row." },
            { icon: "🔁", label: "Correlated subqueries run per row", desc: "They reference the outer query, so the database re-executes them for each outer row. Powerful but potentially slow on large tables." },
            { icon: "✅", label: "EXISTS stops at the first match", desc: "EXISTS returns true as soon as one row is found. It only tests whether rows exist — SELECT 1 inside is conventional." },
            { icon: "⚠️", label: "NOT IN breaks with NULLs", desc: "If any value in the NOT IN list is NULL, the entire condition returns no rows. Use NOT EXISTS instead — it handles NULLs correctly." },
            { icon: "🔗", label: "JOINs often replace correlated subqueries", desc: "When you need columns from the related table, or when performance matters, a JOIN is usually cleaner and faster than a correlated subquery." },
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
