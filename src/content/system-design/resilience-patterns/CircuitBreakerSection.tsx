import { CircuitBreakerSimulator } from "@/components/blog/interactive/circuit-breaker-simulator";

export function CircuitBreakerSection() {
  return (
    <section>
      <h2 id="circuit-breaker" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Circuit Breaker
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The circuit breaker pattern prevents cascading failures by stopping calls to a
        service that is known to be failing. Named after the electrical breaker that
        interrupts current when a fault is detected, it implements a state machine with
        three states: Closed (normal operation), Open (fail-fast, no calls), and Half-Open
        (probe to test recovery).
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The key insight is fail-fast under failure. Without a circuit breaker, a slow
        service causes the caller to queue up waiting threads until its thread pool
        exhausts. With a circuit breaker open, the caller returns an error immediately
        without waiting. This prevents the failure from propagating upstream and frees
        threads to serve other requests.
      </p>

      <CircuitBreakerSimulator />

      <h3 className="text-base font-semibold mt-4 mb-3">The three states</h3>

      <div className="space-y-3 mb-8">
        {[
          {
            state: "CLOSED",
            color: "text-primary bg-primary/10 border-primary/20",
            desc: "Normal operation. All requests pass through to the service. The circuit breaker monitors the failure rate. When consecutive failures reach the threshold, the circuit trips to Open.",
            transition: "Failure count >= threshold → OPEN",
          },
          {
            state: "OPEN",
            color: "text-destructive bg-destructive/10 border-destructive/20",
            desc: "Fail-fast. All requests are rejected immediately without calling the service. The caller receives an error immediately instead of waiting for a timeout. After a configured timeout, the circuit transitions to Half-Open to test recovery.",
            transition: "Timeout elapsed → HALF-OPEN",
          },
          {
            state: "HALF-OPEN",
            color: "text-orange-500 bg-orange-400/10 border-orange-400/20",
            desc: "Probe. One request is allowed through to test whether the service has recovered. If it succeeds, the circuit resets to Closed and normal operation resumes. If it fails, the circuit returns to Open and the timeout resets.",
            transition: "Probe success → CLOSED | Probe failure → OPEN",
          },
        ].map(({ state, color, desc, transition }) => (
          <div key={state} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${color}`}>{state}</span>
            </div>
            <div className="px-4 py-3 space-y-1.5 text-[11px]">
              <p className="text-muted-foreground">{desc}</p>
              <p className="font-mono text-[10px] text-muted-foreground/70">→ {transition}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Implementation with a fallback</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">Python circuit breaker with graceful degradation</p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`from circuitbreaker import circuit

@circuit(
    failure_threshold=5,     # trip after 5 consecutive failures
    recovery_timeout=30,     # wait 30s before half-open probe
    expected_exception=Exception,
)
async def get_recommendations(user_id: str) -> list[str]:
    return await recommendations_service.get(user_id)

async def handler(user_id: str):
    try:
        recs = await get_recommendations(user_id)
        return recs
    except CircuitBreakerOpen:
        # Circuit is open — return cached or static fallback
        # Do NOT let this error propagate to the user
        return get_fallback_recommendations()
    except Exception as e:
        # Service error — circuit will count this failure
        log.warning("recommendations failed", error=str(e))
        return get_fallback_recommendations()

def get_fallback_recommendations() -> list[str]:
    # Return popular items, recently viewed, or empty list
    # Never fail the entire request because of a non-critical service
    return popular_items_cache.get() or []`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">What triggers a circuit breaker</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { trigger: "Consecutive failures", detail: "N failures in a row. Simple and predictable. Sensitive to transient single failures." },
          { trigger: "Failure rate in a window", detail: "X% of requests in the last N seconds fail. Less sensitive to transient spikes. Requires more state." },
          { trigger: "Slow calls", detail: "Calls taking longer than T ms count as failures. Prevents slow degradation from exhausting thread pools." },
          { trigger: "Exception types", detail: "Only count specific exceptions (network errors, 5xx). Ignore 4xx — those are client errors, not service failures." },
        ].map(({ trigger, detail }) => (
          <div key={trigger} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{trigger}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
