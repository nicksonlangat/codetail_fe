import { WhatBreaksSection } from "./zero-downtime-deployments/WhatBreaksSection";
import { GracefulShutdownSection } from "./zero-downtime-deployments/GracefulShutdownSection";
import { MigrationStrategySection } from "./zero-downtime-deployments/MigrationStrategySection";
import { HealthChecksSection } from "./zero-downtime-deployments/HealthChecksSection";
import { ExpandContractSection } from "./zero-downtime-deployments/ExpandContractSection";
import { LargeTableMigrationsSection } from "./zero-downtime-deployments/LargeTableMigrationsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-breaks", title: "What Breaks" },
  { id: "graceful-shutdown", title: "Graceful Shutdown" },
  { id: "migration-strategy", title: "Additive-Only Migrations" },
  { id: "health-checks", title: "Readiness vs Liveness" },
  { id: "expand-contract", title: "The Expand-Contract Pattern" },
  { id: "large-table-migrations", title: "Large-Table Migrations" },
  { id: "summary", title: "Summary" },
];

export default function ZeroDowntimeArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Article 7 drove p95 latency under 100ms. The new constraint is deployment
          safety. Every new version must deploy without dropping a single in-flight
          request or leaving the database in a state that breaks running code. The current
          API fails on all three counts: no SIGTERM handler, no migration discipline, and
          no readiness probe.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          This article fixes all three. A SIGTERM handler in the lifespan context waits
          for in-flight requests before exiting. The additive-only migration rule eliminates
          the window where a migration breaks live code. Split health endpoints tell the
          load balancer when a new instance is ready to accept traffic. The expand-contract
          pattern formalizes how to evolve a schema safely across multiple deploys.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          The rule: old and new code always run simultaneously during a rolling deployment.
          Any migration that old code cannot survive will cause 500s during that window.
        </p>
      </section>

      <WhatBreaksSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <GracefulShutdownSection />
      <MigrationStrategySection />
      <HealthChecksSection />
      <ExpandContractSection />
      <LargeTableMigrationsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "SIGTERM without a handler means requests die mid-flight",
              desc: "Register a SIGTERM handler in the FastAPI lifespan context. Sleep for p99 + buffer after the signal. Dispose the connection pool after the drain. The grace period must be shorter than the load balancer's backend timeout.",
            },
            {
              title: "Never change a column and the code that uses it in the same deploy",
              desc: "Old and new code run simultaneously during a rolling deploy. A column renamed in migration N breaks old instances immediately. The safe pattern: add the new column, deploy code, then remove the old column in a later deploy.",
            },
            {
              title: "Liveness and readiness are different signals",
              desc: "/health/live answers 'is the process alive.' /health/ready answers 'should traffic route here.' Never add external dependency checks to liveness — a database timeout would trigger a restart loop and make the outage worse.",
            },
            {
              title: "Expand-contract is not three steps, it is three deploys",
              desc: "Add the column in deploy 1. Use it in deploy 2. Remove the old state in deploy 3. The constraint is that code for both the old and new state runs at the same time during the deploy window.",
            },
            {
              title: "CREATE INDEX CONCURRENTLY does not lock the table",
              desc: "Standard CREATE INDEX takes a write lock for the duration of the build — minutes on a large table. CONCURRENTLY builds the index using a series of scans without blocking reads or writes. It cannot run inside a transaction.",
            },
            {
              title: "Next: surviving partial failures",
              desc: "Article 9 covers graceful degradation when dependencies fail: timeouts on every external call, a circuit breaker on Redis with database fallback, retry with exponential backoff, and structured error responses.",
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
