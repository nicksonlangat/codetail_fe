import { DiagnoseSection } from "./slow-queries/DiagnoseSection";
import { IndexSection } from "./slow-queries/IndexSection";
import { PaginationSection } from "./slow-queries/PaginationSection";
import { BenchmarkSection } from "./slow-queries/BenchmarkSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "diagnose", title: "Diagnosing Slow Queries" },
  { id: "index", title: "Adding the Index" },
  { id: "cursor-pagination", title: "Cursor-Based Pagination" },
  { id: "benchmark", title: "Benchmark: Before and After" },
  { id: "summary", title: "Summary" },
];

export default function SlowQueriesArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Article 2 fixed concurrency: 100 simultaneous users no longer crash the server.
          The new constraint is latency under scale. As the tasks table grows, the list
          endpoint slows down -- not because of traffic, but because the query itself
          becomes more expensive with every row added.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          This article introduces two fixes: an index that eliminates the sequential
          table scan, and cursor-based pagination that makes deep page reads cost the
          same as page one. It also shows how to find slow queries before users report
          them, using the PostgreSQL slow query log and EXPLAIN ANALYZE.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          The rule of thumb: identify the slow query first, understand why it is slow
          from the query plan, then apply the minimum fix. Guessing and adding indexes
          everywhere is worse than no indexes at all.
        </p>
      </section>

      <DiagnoseSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <IndexSection />
      <PaginationSection />
      <BenchmarkSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Enable the slow query log first",
              desc: "log_min_duration_statement = 200ms surfaces slow queries before users report them. Read the slow query log before guessing at solutions.",
            },
            {
              title: "EXPLAIN ANALYZE tells you why",
              desc: "Seq Scan means the database read every row. Index Scan means it jumped to the relevant rows. External merge means the sort spilled to disk. The plan tells you exactly what to fix.",
            },
            {
              title: "Index the columns you filter and sort on",
              desc: "An index on created_at turns a full table scan into a direct lookup. The query time goes from O(n) to O(log n + k). At 1M rows, that is the difference between 8 seconds and 1 millisecond.",
            },
            {
              title: "Use CREATE INDEX CONCURRENTLY on live tables",
              desc: "Standard CREATE INDEX takes a write lock. On large tables this blocks all inserts for minutes. CONCURRENTLY builds the index without locking -- it takes longer but traffic continues.",
            },
            {
              title: "Cursor pagination is O(1) regardless of depth",
              desc: "OFFSET 10000 reads and discards 10,000 rows. A cursor condition (WHERE created_at < t) reads exactly limit + 1 rows from the index, regardless of how deep into the dataset you are.",
            },
            {
              title: "Next: authentication and authorization",
              desc: "Article 4 adds JWT authentication and scopes every query to the authenticated user. User two must not be able to read user one's tasks -- that requires user_id on every row and in every WHERE clause.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
              <div>
                <p className="text-[13px] font-semibold mb-0.5">{title}</p>
                <p className="text-[12px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
