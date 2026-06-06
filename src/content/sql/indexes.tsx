import { BTreeSection } from "./indexes/BTreeSection";
import { CompositeIndexesSection } from "./indexes/CompositeIndexesSection";
import { ExplainAnalyzeSection } from "./indexes/ExplainAnalyzeSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "btree", title: "How B-Tree Indexes Work" },
  { id: "composite-indexes", title: "Composite Indexes" },
  { id: "explain-analyze", title: "Reading EXPLAIN ANALYZE" },
  { id: "summary", title: "Summary" },
];

export default function IndexesArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A query that takes 20 seconds and a query that takes 2 milliseconds can be word-for-word identical in SQL. The difference is whether the database has an index that lets it find the matching rows without reading everything.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Understanding indexes means understanding why the database chooses to use one or skip it, how composite index column order determines which queries are fast, and how to read the query plan that tells you exactly what the database did.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          By the end of this article you will know how B-tree indexes are structured, the rules for composite index column ordering, what a covering index is, and how to read EXPLAIN ANALYZE output to diagnose slow queries.
        </p>
      </section>

      <BTreeSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <CompositeIndexesSection />
      <ExplainAnalyzeSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "⚡", label: "B-tree indexes keep values sorted", desc: "A B-tree traversal finds any value in O(log n) steps. Without an index, every query requires a full sequential scan — O(n) reads." },
            { icon: "🎯", label: "Selectivity determines whether the planner uses an index", desc: "An index scan is only faster when a small fraction of rows match. For low-selectivity filters like status columns, a sequential scan is often cheaper." },
            { icon: "📋", label: "Composite index column order is critical", desc: "An index on (a, b, c) only helps queries that filter on a leading prefix. Put equality columns before range columns. Put the most selective column first." },
            { icon: "🔍", label: "LIKE with leading wildcard skips the index", desc: "WHERE name LIKE '%smith' cannot use a B-tree because the index is sorted by prefix. WHERE name LIKE 'smith%' can." },
            { icon: "🗂️", label: "Covering indexes eliminate table access", desc: "When an index includes all columns the query needs, the database never touches the table. These index-only scans are significantly faster." },
            { icon: "🔬", label: "EXPLAIN ANALYZE shows the real plan", desc: "Seq Scan means a full table read. Compare estimated rows to actual rows — large discrepancies mean stale statistics. Run ANALYZE to update them." },
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
