const DEGRADATION_EXAMPLES = [
  {
    feature: "Recommendation engine",
    degraded: "Return popular items from cache",
    justification: "Non-critical. User still sees products. Revenue impact minimal.",
  },
  {
    feature: "Personalization service",
    degraded: "Show generic content",
    justification: "Non-critical. User experience slightly worse, but page loads.",
  },
  {
    feature: "Review/ratings service",
    degraded: "Hide review section with 'unavailable' message",
    justification: "Acceptable short-term degradation vs blank page or error.",
  },
  {
    feature: "Analytics tracking",
    degraded: "Drop events (fire and forget)",
    justification: "Loss of analytics data is acceptable. Do not fail requests for telemetry.",
  },
  {
    feature: "Search service",
    degraded: "Return empty results with search hint",
    justification: "Core to some flows, non-critical to others. Degrade search, not checkout.",
  },
  {
    feature: "Payment service",
    degraded: "Do NOT degrade — surface the error",
    justification: "Financial operations must not silently fail. Show error and retry option.",
  },
];

export function BulkheadAndShedSection() {
  return (
    <section>
      <h2 id="bulkhead-shed" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Bulkheads, Load Shedding, and Graceful Degradation
      </h2>

      <h3 className="text-base font-semibold mt-6 mb-3">Bulkhead pattern</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A bulkhead is a partition in a ship's hull that isolates flooding to one compartment.
        In software, it is resource isolation: separate thread pools, connection pools, or
        process limits for different dependencies so that one failing dependency cannot
        exhaust resources shared with healthy ones.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Without bulkheads, a slow payments service consumes all available threads in the
        application's shared thread pool. New requests for any endpoint — including the
        fast, healthy ones — queue and eventually time out. The cascade is horizontal:
        one failing dependency brings down everything.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Thread pool bulkhead — separate pools per downstream service
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`from concurrent.futures import ThreadPoolExecutor

# Isolated pools per dependency — one pool exhausting
# does not affect the others
POOLS = {
    "payments":        ThreadPoolExecutor(max_workers=10),
    "recommendations": ThreadPoolExecutor(max_workers=5),
    "notifications":   ThreadPoolExecutor(max_workers=3),
}

async def call_payments(payload):
    loop = asyncio.get_event_loop()
    try:
        return await asyncio.wait_for(
            loop.run_in_executor(POOLS["payments"], _call_payments, payload),
            timeout=2.0,   # per-pool timeout
        )
    except asyncio.TimeoutError:
        raise PaymentsUnavailableError()

# If recommendations pool is exhausted (5 threads all waiting),
# payments pool (10 threads) is completely unaffected`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Load shedding</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Load shedding is the deliberate rejection of requests when the system is operating
        above its sustainable capacity. The alternative — accepting all requests and
        attempting to serve them all — leads to queuing, growing latency, and eventual
        collapse. A system that rejects 20% of requests under overload can serve the
        remaining 80% well. A system that accepts all requests serves 100% of them badly.
      </p>

      <div className="space-y-2 mb-8">
        {[
          {
            strategy: "Queue depth limit",
            detail: "When the work queue depth exceeds N, return 503 immediately instead of queueing. Downstream consumers see fast failures they can retry, not slow timeouts.",
          },
          {
            strategy: "Concurrency limit",
            detail: "Cap the number of in-flight requests to the server. Requests beyond the limit are rejected with 503. Prevents memory from growing without bound under sustained overload.",
          },
          {
            strategy: "CPU/memory threshold",
            detail: "When CPU > 85% or memory > 90%, start shedding low-priority requests. Protects the process from OOM kills or thrashing under extreme load.",
          },
          {
            strategy: "Priority-based shedding",
            detail: "Assign request priorities (health checks and payments = high; analytics and recommendations = low). Shed low-priority requests first. Critical paths survive overload longer.",
          },
        ].map(({ strategy, detail }) => (
          <div key={strategy} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{strategy}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Graceful degradation</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A resilient system distinguishes between critical and non-critical features.
        When a non-critical dependency fails, the system continues operating at reduced
        capability rather than returning an error. When a critical dependency fails,
        it surfaces the error clearly rather than silently returning wrong data.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Feature</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Degraded behavior</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Justification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {DEGRADATION_EXAMPLES.map(({ feature, degraded, justification }) => (
              <tr key={feature}>
                <td className="py-2.5 pr-4 font-medium text-foreground/80 align-top">{feature}</td>
                <td className={`py-2.5 pr-4 align-top font-mono text-[10px] ${
                  degraded.startsWith("Do NOT") ? "text-destructive" : "text-primary"
                }`}>
                  {degraded}
                </td>
                <td className="py-2.5 text-muted-foreground align-top">{justification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Health checks and readiness</h3>

      <div className="space-y-2">
        {[
          {
            check: "Liveness probe",
            detail: "Is the process alive? Returns 200 if the application is running and not deadlocked. A failing liveness probe causes the container orchestrator to restart the process.",
          },
          {
            check: "Readiness probe",
            detail: "Is the process ready to accept traffic? Returns 200 only when all dependencies (database, cache, upstream services) are reachable. A failing readiness probe removes the instance from the load balancer without restarting it.",
          },
          {
            check: "Startup probe",
            detail: "Has the application finished initializing? Prevents the liveness probe from killing a slow-starting application during boot (database migrations, cache warming).",
          },
          {
            check: "Deep health check",
            detail: "Verifies the full request path: connect to the database, execute a simple query, check cache connectivity. Used by on-call engineers, not by the load balancer (too expensive per-request).",
          },
        ].map(({ check, detail }) => (
          <div key={check} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{check}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
