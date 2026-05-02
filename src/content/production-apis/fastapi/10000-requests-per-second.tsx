import { WhatBreaksSection } from "./10000-requests-per-second/WhatBreaksSection";
import { StatelessSection } from "./10000-requests-per-second/StatelessSection";
import { RateLimitingSection } from "./10000-requests-per-second/RateLimitingSection";
import { BackgroundJobsSection } from "./10000-requests-per-second/BackgroundJobsSection";
import { ReadReplicasSection } from "./10000-requests-per-second/ReadReplicasSection";
import { LoadSheddingSection } from "./10000-requests-per-second/LoadSheddingSection";
import { ArchitectureSection } from "./10000-requests-per-second/ArchitectureSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-breaks", title: "What Breaks" },
  { id: "stateless", title: "Making the App Stateless" },
  { id: "rate-limiting", title: "Per-User Rate Limiting" },
  { id: "background-jobs", title: "Background Job Queue" },
  { id: "read-replicas", title: "Read Replicas" },
  { id: "load-shedding", title: "Load Shedding" },
  { id: "architecture", title: "The Final Architecture" },
  { id: "summary", title: "Summary" },
];

export default function TenKRpsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Article 9 made the API resilient to dependency failures. The final constraint
          is scale: 10,000 requests per second with p95 under 100ms and zero 5xx errors.
          A single FastAPI process can handle roughly 800-1,500 RPS. To reach 10k, the app
          must run as multiple stateless instances behind a load balancer, and the database
          must be split into read and write paths.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          This article adds five changes. The app is already mostly stateless thanks to JWT
          authentication from article 4 — the remaining work is confirming no instance-local
          state exists. Per-user token bucket rate limiting backed by a Redis Lua script
          replaces the per-IP auth limits from article 6. POST /tasks returns 202 Accepted
          and enqueues background work via Celery. Read endpoints use a PostgreSQL read
          replica. A queue-depth middleware sheds load with a 503 before the system saturates.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          The rule: every component added to reach 10k RPS was forced by a constraint. None
          was added speculatively. That is the constraint-driven design the series demonstrated.
        </p>
      </section>

      <WhatBreaksSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <StatelessSection />
      <RateLimitingSection />
      <BackgroundJobsSection />
      <ReadReplicasSection />
      <LoadSheddingSection />
      <ArchitectureSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Stateless means no instance-local correctness state",
              desc: "Connection pools are instance-local and that is fine. Session data, rate limit counters, and job queue state must be in shared infrastructure (Redis) so any instance can handle any request interchangeably.",
            },
            {
              title: "The token bucket must be atomic",
              desc: "Two simultaneous requests reading the same counter will both see a value that allows them through. A Lua script runs atomically on the Redis server: check and decrement happen in one operation, with no race condition between instances.",
            },
            {
              title: "202 Accepted is a contract, not a workaround",
              desc: "POST /tasks returning 202 tells clients the resource was accepted for processing. Include the resource ID and a status_url so clients can fetch the created task immediately and poll for background job status if needed.",
            },
            {
              title: "Read replicas trade replication lag for write relief",
              desc: "A replica lags 50-200ms behind the primary. For most reads this is imperceptible. For read-after-write patterns (immediately GET after POST), route the first read to the primary or rely on the Redis cache which is populated synchronously.",
            },
            {
              title: "Load shedding with 503 is better than timeout with nothing",
              desc: "A 503 returns immediately, includes a Retry-After header, and frees the connection slot. A timeout holds the connection for seconds and returns no useful information. Shed load explicitly rather than letting the system degrade silently.",
            },
            {
              title: "Ten articles, one constraint arc",
              desc: "The API evolved from SQLite to a five-layer system by adding exactly one constraint at a time. No component was added before it was needed. This is the production engineering mindset: measure first, optimize second, scale third.",
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
