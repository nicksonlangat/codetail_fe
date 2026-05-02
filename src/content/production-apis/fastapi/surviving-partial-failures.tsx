import { WhatBreaksSection } from "./surviving-partial-failures/WhatBreaksSection";
import { TimeoutsSection } from "./surviving-partial-failures/TimeoutsSection";
import { CircuitBreakerSection } from "./surviving-partial-failures/CircuitBreakerSection";
import { CacheFallthroughSection } from "./surviving-partial-failures/CacheFallthroughSection";
import { RetrySection } from "./surviving-partial-failures/RetrySection";
import { StructuredErrorsSection } from "./surviving-partial-failures/StructuredErrorsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-breaks", title: "What Breaks" },
  { id: "timeouts", title: "Timeouts on Every Call" },
  { id: "circuit-breaker", title: "Circuit Breaker" },
  { id: "cache-fallthrough", title: "Cache Fallthrough" },
  { id: "retry", title: "Retry with Backoff" },
  { id: "structured-errors", title: "Structured Error Responses" },
  { id: "summary", title: "Summary" },
];

export default function PartialFailuresArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Article 8 made deployments safe. The new constraint is resilience. The API must
          degrade gracefully when its dependencies fail, not fail completely alongside them.
          Redis going down should cause a latency increase, not a 500 rate spike. A slow
          database query should return 503 after 3 seconds, not hold a connection pool
          slot for 5 minutes.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          This article adds four independent failure handling patterns. Timeouts on every
          external call bound the blast radius of slow dependencies. A circuit breaker on
          Redis stops accumulating failed connections when Redis is down. Cache fallthrough
          serves requests from the database when the cache is unavailable. Retry with
          exponential backoff and jitter makes transient errors invisible. A consistent
          error response schema makes all failures parseable by clients.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          The rule: a dependency failure should never cause a complete endpoint failure unless
          the dependency is strictly required. The cache is optional. The database is not.
        </p>
      </section>

      <WhatBreaksSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <TimeoutsSection />
      <CircuitBreakerSection />
      <CacheFallthroughSection />
      <RetrySection />
      <StructuredErrorsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Every external call needs a timeout",
              desc: "A slow dependency without a timeout holds a connection pool slot for the duration of the database's default statement timeout, which may be minutes. Set pool_timeout, command_timeout, and socket_timeout to bound the wait to seconds, not minutes.",
            },
            {
              title: "A circuit breaker stops amplifying a failing dependency",
              desc: "After N failures, stop calling the dependency and return a fallback immediately. Give the dependency time to recover behind the open circuit. The half-open state probes for recovery without exposing the full request volume.",
            },
            {
              title: "Cache unavailability is a latency event, not an error event",
              desc: "Wrap every Redis call in try/except and fall through to the database on failure. Log the fallthrough. Alert when the fallthrough rate exceeds a threshold. Never let a cache exception propagate to the caller as a 500.",
            },
            {
              title: "Retry only idempotent operations",
              desc: "Retrying a POST creates duplicate resources if the first request succeeded and only the response was lost. Only GET, HEAD operations are safe to retry. Use exponential backoff with jitter to avoid thundering herd on recovery.",
            },
            {
              title: "Structured error responses with a code field are an API contract",
              desc: "Clients parse error responses. Inconsistent shapes (detail, error, message) require clients to handle every variation. A stable {error, code, request_id} schema lets clients branch on code and include request_id in bug reports.",
            },
            {
              title: "Next: 10,000 requests per second",
              desc: "Article 10 scales the API to 10k RPS: stateless application design, per-user token bucket rate limiting, background job queues with 202 Accepted, read replica routing, and load shedding to prevent queue saturation.",
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
