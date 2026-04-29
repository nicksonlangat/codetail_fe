import { FailureModesSection } from "./resilience-patterns/FailureModesSection";
import { CircuitBreakerSection } from "./resilience-patterns/CircuitBreakerSection";
import { RetryAndTimeoutSection } from "./resilience-patterns/RetryAndTimeoutSection";
import { BulkheadAndShedSection } from "./resilience-patterns/BulkheadAndShedSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "failure-modes", title: "How Distributed Systems Fail" },
  { id: "circuit-breaker", title: "Circuit Breaker" },
  { id: "retry-timeout", title: "Retries and Timeouts" },
  { id: "bulkhead-shed", title: "Bulkheads, Shedding, Degradation" },
  { id: "summary", title: "Summary" },
];

export default function ResilienceArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Distributed systems fail in ways that single-process systems do not. Partial
          failures, slow dependencies, network drops, and cascading overload are not
          edge cases — they are expected operating conditions. A resilient system is not
          one that never fails. It is one where failures are contained, detected quickly,
          and recovered from automatically without human intervention.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The circuit breaker stops calls to a known-failing service, preventing cascading
          failures from propagating upstream. Timeouts bound how long any call can occupy
          a thread. Retries with exponential backoff and jitter handle transient failures
          without amplifying load. Bulkheads isolate resource pools so one slow dependency
          cannot exhaust resources used by healthy ones.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          Together these patterns implement defense in depth: each layer catches failures
          the previous layer missed. No single pattern is sufficient. A system with
          retries but no circuit breaker amplifies load on a failing service. A system
          with a circuit breaker but no fallback surfaces failures to users. Resilience
          requires the full stack.
        </p>
      </section>

      <FailureModesSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <CircuitBreakerSection />
      <RetryAndTimeoutSection />
      <BulkheadAndShedSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "💥",
              label: "Distributed systems fail partially and slowly",
              desc: "Gray failures (slow, not crashed) and cascading failures are more dangerous than crashes. A crashed service is detected immediately. A slow one is not.",
            },
            {
              icon: "⚡",
              label: "Circuit breaker: fail-fast under failure",
              desc: "CLOSED passes requests. OPEN rejects immediately. HALF-OPEN probes recovery. The circuit prevents cascades by stopping calls to known-failing services.",
            },
            {
              icon: "⏱️",
              label: "Every outbound call needs a timeout",
              desc: "Without timeouts, a slow service occupies threads until they exhaust. Set connection timeout, read timeout, and total request budget. Tune per endpoint, not globally.",
            },
            {
              icon: "🔁",
              label: "Retry idempotent operations with jitter",
              desc: "Exponential backoff with full jitter spreads retries across time. Use idempotency keys to make non-idempotent operations safe to retry. Never retry 4xx errors.",
            },
            {
              icon: "🚢",
              label: "Bulkheads isolate failure domains",
              desc: "Separate thread pools per downstream dependency. One exhausted pool does not block others. The payments pool failing does not block recommendations.",
            },
            {
              icon: "📉",
              label: "Degrade gracefully; shed load explicitly",
              desc: "Non-critical features return cached or static fallbacks. Return 503 when overloaded rather than queueing forever. Critical paths must never silently degrade.",
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
