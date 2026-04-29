const FAILURE_TYPES = [
  {
    type: "Crash failure",
    desc: "A service stops responding entirely. The process dies, the container exits, the node goes dark. The caller gets a connection refused or a timeout with no response.",
    detection: "Health checks fail. Load balancer stops routing. Kubernetes restarts the pod.",
    danger: "Low — detectable immediately, routing recovers automatically.",
  },
  {
    type: "Slow failure (gray failure)",
    desc: "The service responds, but slowly. Requests take 3 seconds instead of 100ms. The caller's thread pool exhausts waiting. Upstream callers queue up. The system appears running but cannot serve load.",
    detection: "Latency percentiles (p99) spike. Connection pools saturate. Upstream timeout errors increase.",
    danger: "High — harder to detect than crashes. Cascades upstream before anyone notices.",
  },
  {
    type: "Partial failure",
    desc: "Some requests succeed, some fail. One database replica is degraded. One microservice instance returns 500s. The failure is non-deterministic from the caller's perspective.",
    detection: "Error rate increases (not to 100%). Requires per-instance monitoring. Log sampling can miss it.",
    danger: "High — load balancers retry on failed instances, masking the failure and increasing overall latency.",
  },
  {
    type: "Cascading failure",
    desc: "Service A slows down. Service B, which calls A, backs up. Service C, which calls B, backs up. Thread pools fill. The entire call chain fails. One slow database brings down the whole system.",
    detection: "Correlated latency and error spikes across services. Distributed trace shows the originating bottleneck.",
    danger: "Critical — the failure is non-local. The failed service may not be the one showing symptoms.",
  },
  {
    type: "Thundering herd",
    desc: "A cache expires or a service restarts. Every client that was waiting retries simultaneously. The newly recovered service receives 10x its normal load and falls over immediately.",
    detection: "Traffic spike precisely when a service recovers. Cache miss rate spikes to 100% for one interval.",
    danger: "High — the recovery event triggers the failure. Systems can oscillate between up and down.",
  },
];

export function FailureModesSection() {
  return (
    <section>
      <h2 id="failure-modes" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        How Distributed Systems Fail
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Distributed systems do not fail cleanly. In a monolith, a crash is a crash: the
        process dies and the error is immediate. In a distributed system, failures are
        partial, probabilistic, and often invisible. A service can be running while
        returning garbage. A database can be up while timing out on every write. A network
        can be connected while dropping 10% of packets.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Resilience engineering is about designing for failures that you cannot prevent.
        Hardware fails, networks partition, dependencies time out, bugs are deployed.
        The goal is not to eliminate these events — it is to bound their impact: contain
        the failure domain, degrade gracefully under load, recover automatically without
        human intervention.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Failure taxonomy</h3>

      <div className="space-y-3 mb-8">
        {FAILURE_TYPES.map(({ type, desc, detection, danger }) => (
          <div key={type} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{type}</span>
              <span className={`ml-auto text-[8px] font-mono px-1.5 py-0.5 rounded border ${
                danger.startsWith("Critical") ? "text-destructive bg-destructive/10 border-destructive/20" :
                danger.startsWith("High") ? "text-orange-500 bg-orange-400/10 border-orange-400/20" :
                "text-primary bg-primary/10 border-primary/20"
              }`}>
                {danger.split(" — ")[0]}
              </span>
            </div>
            <div className="px-4 py-3 space-y-1.5 text-[11px]">
              <p className="text-muted-foreground">{desc}</p>
              <p>
                <span className="font-medium text-foreground/80">Detection: </span>
                <span className="text-muted-foreground">{detection}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The fallacies of distributed computing</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Peter Deutsch and James Gosling catalogued the eight assumptions engineers make
        about networks that are always false in production. Each false assumption is a
        category of failure that resilience patterns must address.
      </p>

      <div className="grid gap-2 sm:grid-cols-2 mb-6">
        {[
          ["The network is reliable", "Packets drop. Links fail. Routers restart. TCP handles retransmission, but application-level retries are still needed."],
          ["Latency is zero", "Cross-datacenter calls add 50-150ms. Cross-continent: 150-300ms. Timeouts must be set lower than the caller's patience."],
          ["Bandwidth is infinite", "Serializing large objects for network calls is expensive. Payload size matters at scale."],
          ["The network is secure", "Traffic must be encrypted (TLS). Internal service-to-service calls are not inherently safe."],
          ["Topology doesn't change", "Services scale, move, and restart. Service discovery must be dynamic, not hardcoded IPs."],
          ["There is one administrator", "Multiple teams, multiple services, independent deployments. No single party controls the full system."],
          ["Transport cost is zero", "Network I/O is expensive in CPU cycles and latency compared to in-process calls."],
          ["The network is homogeneous", "Different services use different protocols, encodings, and versioning. Integration is never uniform."],
        ].map(([fallacy, reality]) => (
          <div key={fallacy} className="bg-card border border-border rounded-xl p-3">
            <p className="text-[11px] font-semibold text-orange-500 mb-1">Fallacy: {fallacy}</p>
            <p className="text-[11px] text-muted-foreground">{reality}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
