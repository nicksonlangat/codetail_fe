import { WhyIndexesSection } from "./indexes-and-query-optimization/WhyIndexesSection";
import { BTreeSection } from "./indexes-and-query-optimization/BTreeSection";
import { IndexTypesSection } from "./indexes-and-query-optimization/IndexTypesSection";
import { QueryOptimizationSection } from "./indexes-and-query-optimization/QueryOptimizationSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "why-indexes", title: "The Problem: Full Table Scans" },
  { id: "btree-indexes", title: "How B-tree Indexes Work" },
  { id: "index-types", title: "Index Design: Types and Trade-offs" },
  { id: "query-optimization", title: "Query Optimization and Common Pitfalls" },
  { id: "summary", title: "Summary" },
];

export default function IndexesArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A slow query is almost always one of two things: either the query reads more rows
          than it needs to, or it makes more round-trips to the database than necessary.
          Indexes solve the first problem. Query design solves the second. Together they
          account for the vast majority of database performance issues in production systems.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The difference between a query that takes 200ms and one that takes 0.05ms on the
          same data is usually a single CREATE INDEX statement. This is not an exaggeration.
          A million-row table without an index on the search column requires every row to be
          read and compared. With the right index, the database makes twenty comparisons.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers why full table scans are slow, how B-tree indexes enable
          O(log n) lookups, the different index types and when to use each, and the most
          common query anti-patterns that cause slowness even when indexes exist.
        </p>
      </section>

      <WhyIndexesSection />
      <BTreeSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <IndexTypesSection />
      <QueryOptimizationSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "📉",
              label: "Full scans are O(n), indexes are O(log n)",
              desc: "Without an index, 1 million rows means 1 million reads. With a B-tree index it means at most 20 comparisons. The difference is several orders of magnitude.",
            },
            {
              icon: "🌳",
              label: "B-trees stay balanced automatically",
              desc: "Height stays at O(log n) as data grows. A billion-row table is reachable in 30 comparisons. Real B+ trees with high branching factors achieve this in 3-5 levels.",
            },
            {
              icon: "🔑",
              label: "Composite index column order is critical",
              desc: "The leftmost prefix rule: an index on (A, B, C) is usable for queries filtering on A, A+B, or A+B+C. Queries filtering only on B or C cannot use the index.",
            },
            {
              icon: "🔄",
              label: "N+1 is the most common ORM bug",
              desc: "Fetching N records and then issuing one query per record inside a loop sends N+1 queries. Fix with select_related, prefetch_related, or explicit JOINs.",
            },
            {
              icon: "🔎",
              label: "EXPLAIN is your most important diagnostic",
              desc: "Run EXPLAIN ANALYZE on any slow query. Look for Seq Scan on large tables. Index Scan means the B-tree is being used. Index Only Scan is the best case.",
            },
            {
              icon: "⚠️",
              label: "Indexes have write costs",
              desc: "Every index must be maintained on INSERT, UPDATE, DELETE. Index columns in WHERE, JOIN ON, and ORDER BY. Do not index columns that queries never filter on.",
            },
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
