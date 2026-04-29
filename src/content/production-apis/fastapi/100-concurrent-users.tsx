import { WhatBreaksSection } from "./100-concurrent-users/WhatBreaksSection";
import { PostgresSection } from "./100-concurrent-users/PostgresSection";
import { AsyncSection } from "./100-concurrent-users/AsyncSection";
import { BenchmarkSection } from "./100-concurrent-users/BenchmarkSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-breaks", title: "What Breaks" },
  { id: "postgres", title: "Migrating to PostgreSQL" },
  { id: "async-handlers", title: "Async Handlers and Health Check" },
  { id: "benchmark", title: "Benchmark: Before and After" },
  { id: "summary", title: "Summary" },
];

export default function ConcurrentUsersArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The baseline works for a single developer. Now apply the first real constraint:
          100 concurrent users sending requests simultaneously. Three things break
          immediately, each for a distinct reason.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          This article makes the minimum changes needed to satisfy the constraint. SQLite
          is replaced with PostgreSQL. Sync handlers are rewritten as async. A health
          endpoint is added. Nothing else changes -- the data model, the schemas, and
          the three routes stay identical.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          The diff is instructive: every change maps directly to one of the failure modes.
          There is no speculative work, no "while we are in here" cleanup. The constraint
          tells you exactly what to fix and exactly when to stop.
        </p>
      </section>

      <WhatBreaksSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <PostgresSection />
      <AsyncSection />
      <BenchmarkSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "SQLite to PostgreSQL: one line changes",
              desc: "The connection string and engine constructor change. The session interface, ORM models, and Pydantic schemas stay identical. The migration is surgical.",
            },
            {
              title: "async def is the correct default for FastAPI",
              desc: "Sync handlers in an ASGI app waste threads on I/O wait. Every handler that touches a database or external service should be async. This is not a performance optimisation -- it is using the framework correctly.",
            },
            {
              title: "pool_size controls steady-state connections",
              desc: "pool_size=10 keeps 10 connections open permanently. max_overflow=20 allows 20 more under burst load. Size the pool to your Postgres max_connections budget, not to your peak request rate.",
            },
            {
              title: "The health endpoint is not optional",
              desc: "GET /health returning {status: ok} is the contract between your app and every piece of infrastructure that manages it. Without it, load balancers route to unhealthy pods and deployments cannot verify readiness.",
            },
            {
              title: "p99 matters more than p50",
              desc: "The baseline p50 of 85ms looked tolerable. The p99 of 5,800ms did not. Always measure tail latency under concurrency -- the median hides the failures that users actually experience.",
            },
            {
              title: "Next: slow queries",
              desc: "The connection pool and async engine fixed concurrency. The list endpoint still does a full table scan. Article 3 introduces EXPLAIN ANALYZE, composite indexes, and cursor-based pagination.",
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
