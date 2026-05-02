import { WhatBreaksSection } from "./sub-100ms-latency/WhatBreaksSection";
import { CacheAsideSection } from "./sub-100ms-latency/CacheAsideSection";
import { CacheInvalidationSection } from "./sub-100ms-latency/CacheInvalidationSection";
import { ResponseTrimmingSection } from "./sub-100ms-latency/ResponseTrimmingSection";
import { ProfilingSection } from "./sub-100ms-latency/ProfilingSection";
import { BenchmarkSection } from "./sub-100ms-latency/BenchmarkSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-breaks", title: "What Breaks" },
  { id: "cache-aside", title: "Redis Cache-Aside" },
  { id: "invalidation", title: "Cache Invalidation" },
  { id: "response-trimming", title: "Response Model Trimming" },
  { id: "profiling", title: "Reading a Flamegraph" },
  { id: "benchmark", title: "Benchmark: Before and After" },
  { id: "summary", title: "Summary" },
];

export default function LatencyArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Article 6 hardened the API against the OWASP Top 10. The new constraint is speed.
          p95 latency on the detail endpoint must be under 100ms at 100 RPS. The current API
          hits the database on every request for GET /tasks/{"{id}"}. At 100 RPS that means 100
          database round-trips per second for a read that rarely changes. The fix is a
          cache layer between the handler and the database.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          This article adds three optimizations. Redis cache-aside on the detail endpoint
          drops p95 from 138ms to 11ms. Response model trimming reduces serialization cost
          on the list endpoint by cutting fields the list view never uses. Optional profiling
          middleware with pyinstrument makes latency regressions diagnosable to the specific
          function, not just the request.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          The rule: include the user ID in every cache key. An authorization check that only
          runs on a database read is bypassed on every cache hit if the key is not scoped
          to the user.
        </p>
      </section>

      <WhatBreaksSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <CacheAsideSection />
      <CacheInvalidationSection />
      <ResponseTrimmingSection />
      <ProfilingSection />
      <BenchmarkSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Include the user ID in every cache key",
              desc: "A cache hit bypasses the authorization check in the handler. If the key is task:42, user B can read user A's task after the first cache population. The key must be task:{user_id}:{task_id}.",
            },
            {
              title: "TTL is a safety net, invalidation is the correctness guarantee",
              desc: "A TTL protects against stale cache entries surviving indefinitely. Explicit delete on write gives you immediate consistency. Use both: explicit invalidation on update and delete, TTL as the fallback for any edge case you missed.",
            },
            {
              title: "Response models are a performance lever",
              desc: "Pydantic projects at serialization time. Fields present on the ORM object but absent from the response model are silently dropped. Use a lightweight summary model for list endpoints and a full detail model for single-record endpoints.",
            },
            {
              title: "Traces show where time goes across spans, profiles show where within a span",
              desc: "OpenTelemetry attributes latency to the DB span, the Redis span, the handler. pyinstrument attributes latency to individual Python functions within the handler. You need both to find the optimization target.",
            },
            {
              title: "p95 at 94% cache hit rate is not p95 at 100% hit rate",
              desc: "Cache benchmarks are meaningless without a hit rate. 11ms p95 assumes 94% of requests are served from cache. The 6% that miss the cache still pay the full 138ms database round-trip. This shows up in p99.",
            },
            {
              title: "Next: zero-downtime deployments",
              desc: "Article 8 covers deploying new versions without dropping requests: graceful SIGTERM handling, additive-only Alembic migrations, and the expand-contract pattern for schema changes on large tables.",
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
