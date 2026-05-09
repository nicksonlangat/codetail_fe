import { WhatIsSection } from "./n-plus-one-queries/WhatIsSection";
import { DetectingSection } from "./n-plus-one-queries/DetectingSection";
import { SolvingSection } from "./n-plus-one-queries/SolvingSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-is", title: "What the N+1 Problem Is" },
  { id: "detecting", title: "Detecting N+1 Queries" },
  { id: "solving", title: "Solving N+1 Queries" },
  { id: "summary", title: "Summary" },
];

export default function NPlusOneArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The N+1 query problem is one of the most common performance issues in
          applications that use an ORM. The code looks correct. The tests pass. The
          feature works in development. Then it goes to production, the dataset grows
          to a few thousand rows, and an endpoint that should take 50ms starts taking
          five seconds.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The name describes the shape: one query to fetch a list, then N additional
          queries — one per row — to load associated data. The ORM makes each query
          invisible in the code because it fires them lazily, on attribute access, inside
          a loop that looks like ordinary iteration.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article explains what causes the N+1 problem, how to detect it in
          development before it reaches production, and the two solutions that eliminate
          it: JOIN-based eager loading and prefetch with a batched IN query.
        </p>
      </section>

      <WhatIsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <DetectingSection />
      <SolvingSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔁",
              label: "N+1 = 1 query + N per-row queries",
              desc: "One query fetches the list. One query per row fetches the related data. The total query count equals the result set size plus one.",
            },
            {
              icon: "🙈",
              label: "ORMs make it invisible",
              desc: "Lazy loading means related data is fetched on attribute access. The SQL is hidden behind a property. The loop looks like plain Python but hits the database on each iteration.",
            },
            {
              icon: "🔍",
              label: "Detect by counting queries per request",
              desc: "In tests, assert that a list endpoint runs a fixed number of queries. If query count scales with row count, there is an N+1. assertNumQueries, echo=True, and query-counting fixtures find it early.",
            },
            {
              icon: "🔗",
              label: "SELECT + JOIN: one query, all data",
              desc: "select_related (Django) or joinedload (SQLAlchemy) fetches the parent and related data in a single JOIN query. Best for single related objects via foreign key.",
            },
            {
              icon: "📦",
              label: "Prefetch: two queries, batched IN",
              desc: "prefetch_related runs two queries: one for parents, one for all related rows using WHERE id IN (...). Fixed query count regardless of result size. Best for one-to-many relationships.",
            },
            {
              icon: "🔀",
              label: "DataLoader: batch across resolvers",
              desc: "In GraphQL APIs, DataLoader collects all IDs requested within a single event loop tick and batches them into one IN query. Eliminates N+1 in resolver trees without changing resolver code.",
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
