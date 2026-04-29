import { WhyRateLimitSection } from "./rate-limiting/WhyRateLimitSection";
import { AlgorithmsSection } from "./rate-limiting/AlgorithmsSection";
import { ImplementationSection } from "./rate-limiting/ImplementationSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "why-rate-limit", title: "Why Rate Limiting Exists" },
  { id: "algorithms", title: "Algorithms" },
  { id: "implementation", title: "Distributed Implementation" },
  { id: "summary", title: "Summary" },
];

export default function RateLimitingArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Rate limiting is admission control for your API. It decides how many requests a
          client can make within a given time window, and what happens when they exceed that
          allowance. Without it, any single client can consume resources provisioned for
          thousands, turning your API into a shared tragedy.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The algorithm determines how usage is measured and how burst traffic is handled.
          Token bucket allows short bursts up to a capacity, then limits to a refill rate.
          Fixed window counts requests in discrete intervals and resets cleanly, but allows
          a spike of 2x at window boundaries. Sliding window eliminates that spike by
          measuring a rolling period, at the cost of more memory or a small accuracy
          approximation.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          In a distributed system, rate limit state must live in a shared store so multiple
          application instances enforce the same limit. Redis is the standard: atomic Lua
          scripts ensure correctness, and a key per user per window is all the state needed.
          This article covers why rate limiting is necessary, how the three main algorithms
          work, and how to implement them correctly in production.
        </p>
      </section>

      <WhyRateLimitSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <AlgorithmsSection />
      <ImplementationSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🛡️",
              label: "Rate limiting protects shared resources",
              desc: "Without it, one misbehaving client degrades or crashes the service for everyone. Credential stuffing, runaway clients, and scraping all become trivially easy.",
            },
            {
              icon: "🪣",
              label: "Token bucket: burst-tolerant, steady-state enforcing",
              desc: "Tokens accumulate up to capacity. Each request costs a token. Burst allowed up to capacity. Then limited to refill rate. Most production-appropriate algorithm.",
            },
            {
              icon: "⏱️",
              label: "Fixed window: simple but has boundary weakness",
              desc: "Counter resets on a fixed schedule. Trivial to implement with Redis INCR + EXPIRE. Allows 2x limit in a 2-second span across a window boundary.",
            },
            {
              icon: "📊",
              label: "Sliding window: accurate, no boundary spike",
              desc: "Measures a rolling time period. No boundary burst vulnerability. Sliding window counter approximation is memory-efficient and accurate enough for most cases.",
            },
            {
              icon: "🔴",
              label: "Redis + Lua for distributed correctness",
              desc: "Multiple instances must share rate limit state. Lua scripts run atomically in Redis — no race conditions. Token bucket and sliding window are both implementable as single Lua scripts.",
            },
            {
              icon: "📬",
              label: "429 with Retry-After is non-negotiable",
              desc: "A 429 without Retry-After causes immediate retry storms. Always include Retry-After, X-RateLimit-Remaining, and a structured JSON error body. Layer at gateway AND application middleware.",
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
