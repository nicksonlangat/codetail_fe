const LATENCY_COMPARISON = [
  { scenario: "Checkout API waits for email to send", type: "sync", latency: "1.2 s", risk: "Email timeout = checkout timeout" },
  { scenario: "Checkout API waits for PDF invoice to generate", type: "sync", latency: "3.4 s", risk: "PDF service outage = checkout outage" },
  { scenario: "Checkout API waits for loyalty points to update", type: "sync", latency: "0.8 s", risk: "Points DB slowdown = slow checkout" },
  { scenario: "Checkout API publishes order.created event", type: "async", latency: "12 ms", risk: "Isolated — downstream failures do not propagate" },
];

export function WhyQueuesSection() {
  return (
    <section>
      <h2 id="why-queues" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        The Coupling Problem
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Synchronous APIs couple callers to the availability, latency, and correctness of their
        dependencies. When service A calls service B and waits for a response, A inherits B's
        failure modes. If B is slow, A is slow. If B is down, A errors. If B starts returning
        5xx errors, A propagates them to its own callers. The failure domain of one service
        becomes the failure domain of every service that depends on it, transitively.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Message queues and event streams break this coupling. The producer writes a message to
        a broker and returns immediately, without knowing who will process the message or when.
        The consumer reads from the broker when it is ready, without knowing who produced the
        message. The broker absorbs the mismatch: producers can be faster than consumers for a
        while (buffering), consumers can be in different datacenters (routing), consumers can
        fail and reconnect without losing messages (durability).
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Synchronous vs async: a concrete example</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A checkout endpoint that synchronously calls email, invoice, and loyalty services before
        returning to the client takes over 5 seconds and inherits three failure modes. The same
        endpoint that publishes a single order.created event returns in 12 ms. The downstream
        work happens asynchronously, in parallel, independently.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Scenario</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Model</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Latency</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {LATENCY_COMPARISON.map(({ scenario, type, latency, risk }) => (
              <tr key={scenario}>
                <td className="py-2.5 pr-4 text-foreground/80 align-top">{scenario}</td>
                <td className="py-2.5 pr-4 align-top">
                  <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                    type === "async"
                      ? "text-primary bg-primary/10 border-primary/20"
                      : "text-orange-500 bg-orange-400/10 border-orange-400/20"
                  }`}>
                    {type}
                  </span>
                </td>
                <td className="py-2.5 pr-4 font-mono text-[11px] align-top">{latency}</td>
                <td className="py-2.5 text-muted-foreground align-top">{risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">What a queue buys you</h3>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          {
            label: "Decoupling",
            desc: "Producer and consumer do not need to be running at the same time. Each evolves independently. Adding a new consumer requires no change to the producer.",
          },
          {
            label: "Buffering",
            desc: "When bursts of traffic arrive faster than consumers can process, the queue absorbs the difference. Consumers drain it at their own pace. No requests dropped, no timeouts.",
          },
          {
            label: "Durability",
            desc: "Messages persisted to disk survive consumer restarts. If the email service crashes, the order.created messages wait in the queue until it comes back.",
          },
          {
            label: "Load distribution",
            desc: "Multiple consumer instances share the queue. More instances = more throughput. Scale consumers independently of producers without any coordination.",
          },
          {
            label: "Failure isolation",
            desc: "A slow or failing consumer does not cascade to the producer. The producer publishes and moves on. The system degrades gracefully rather than failing completely.",
          },
          {
            label: "Retry without burden on the caller",
            desc: "The broker (or consumer) handles retries with backoff. The producer does not need to implement retry logic. Failed messages go to a dead-letter queue for inspection.",
          },
        ].map(({ label, desc }) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">+</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{label}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Backpressure</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Backpressure is what happens when producers outrun consumers for long enough that the
        queue itself becomes a problem. A queue that grows unbounded will eventually exhaust
        memory or disk. Backpressure is the mechanism by which a system signals "slow down" to
        its upstream.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 not-prose space-y-3 mb-6">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">Backpressure strategies</p>
        {[
          {
            name: "Block the producer",
            desc: "Producer blocks on publish until the queue has capacity. Simple but couples producer to queue depth. Only works when producers can tolerate blocking.",
          },
          {
            name: "Drop messages",
            desc: "When the queue is full, new messages are dropped. Acceptable for metrics and telemetry where data loss is tolerable. Never acceptable for financial events.",
          },
          {
            name: "Reject at the edge",
            desc: "The API gateway returns 429 Too Many Requests when the downstream queue is full. The caller retries later. Keeps the queue bounded; pushes retry burden to clients.",
          },
          {
            name: "Scale consumers",
            desc: "Add consumer instances when queue depth exceeds a threshold. Auto-scaling based on queue depth (SQS + CloudWatch, Keda on Kubernetes) handles this automatically.",
          },
        ].map(({ name, desc }) => (
          <div key={name} className="flex gap-3 p-3 bg-muted/30 rounded-xl">
            <span className="text-primary font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[11px] font-semibold mb-0.5">{name}</p>
              <p className="text-[10px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
