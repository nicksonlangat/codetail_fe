const DELIVERY_GUARANTEES = [
  {
    name: "At-most-once",
    aka: "fire and forget",
    color: "text-orange-500 bg-orange-400/10 border-orange-400/20",
    behavior: "Message sent once. If the consumer crashes before processing, message is lost. No retry.",
    implementation: "Publish and forget. No ack. RabbitMQ auto-ack mode. UDP-style.",
    cost: "Zero broker overhead. Lowest latency.",
    when: "Metrics, logs, telemetry where occasional loss is acceptable.",
  },
  {
    name: "At-least-once",
    aka: "ack-based retry",
    color: "text-primary bg-primary/10 border-primary/20",
    behavior: "Message delivered until the consumer explicitly acks it. Consumer crashes = redeliver. Message may be processed more than once.",
    implementation: "Consumer acks after processing. Broker retains message until ack received. RabbitMQ manual ack, SQS visibility timeout, Kafka offset commit.",
    cost: "Consumers must be idempotent. Duplicate processing is normal, not an error.",
    when: "Most production workloads. Default choice. Design consumers to handle duplicates.",
  },
  {
    name: "Exactly-once",
    aka: "transactional delivery",
    color: "text-muted-foreground bg-muted border-border",
    behavior: "Each message processed exactly one time, even with failures and retries. The holy grail.",
    implementation: "Requires coordination: idempotency keys (deduplicate on consumer side), or distributed transactions (Kafka transactions, SQS FIFO with deduplication ID).",
    cost: "Significant complexity and latency overhead. True exactly-once is often impossible across system boundaries — settle for idempotent at-least-once instead.",
    when: "Financial transactions, inventory deduction. Usually implemented as idempotent at-least-once, not true exactly-once.",
  },
];

const PATTERNS = [
  {
    name: "Competing Consumers",
    type: "Queue",
    diagram: "Producer → [Queue] → Consumer 1\n                  → Consumer 2\n                  → Consumer 3",
    desc: "Multiple consumer instances read from the same queue. Each message goes to one consumer. Adding instances scales throughput linearly. The queue distributes work automatically.",
    use: "Job queues, order processing, background task execution.",
    watch: "Ensure consumers are stateless or that shared state is coordinated (e.g., database row lock). Order across consumers is not guaranteed.",
  },
  {
    name: "Pub/Sub (Fanout)",
    type: "Both",
    diagram: "Producer → [Topic/Exchange]\n                → Consumer Group A (billing)\n                → Consumer Group B (email)\n                → Consumer Group C (analytics)",
    desc: "One event, many independent consumers. Each consumer group receives all messages. New consumers can subscribe without producer changes. Classic event-driven architecture.",
    use: "order.created triggers billing, email, inventory, and analytics independently.",
    watch: "In a stream (Kafka), consumer groups each get a full copy. In a queue (RabbitMQ fanout exchange), a copy is created per binding.",
  },
  {
    name: "Dead Letter Queue (DLQ)",
    type: "Queue",
    diagram: "Consumer fails 3x → [DLQ]\n                     ↓\n               Inspect + replay",
    desc: "Messages that fail processing N times (configurable) are moved to a DLQ instead of being retried forever. Engineers inspect and replay or discard them after investigation.",
    use: "Every production queue should have a DLQ. Without one, poison messages block the queue or spin in retry loops consuming resources.",
    watch: "Set DLQ alerts. A growing DLQ is a consumer bug or bad message format. Review DLQ contents on deploy.",
  },
  {
    name: "Event Sourcing",
    type: "Stream",
    diagram: "Commands → [Event Log]\n                → Current state = replay(all events)\n                → Projection A (read model)\n                → Projection B (audit log)",
    desc: "The event log is the source of truth. Current state is derived by replaying events from the log. State can be reconstructed at any point in time. Kafka is the natural storage layer.",
    use: "Financial ledgers, inventory systems, audit trails where history matters more than current state.",
    watch: "Schema evolution is hard. Events are immutable — a bug in event structure is permanent. Versioning and upcasting strategy required from day one.",
  },
  {
    name: "Saga Pattern",
    type: "Both",
    diagram: "order.created → reserve inventory\n               → payment.charged → ship order\n               ← payment.failed → release inventory (compensate)",
    desc: "Long-running distributed transactions implemented as a sequence of local transactions and compensating actions. Each step publishes an event. If a step fails, compensating events undo prior steps.",
    use: "Multi-service workflows: checkout (payment + inventory + shipping). Replaces two-phase commit across services.",
    watch: "Compensating actions must be idempotent. Partial failures leave systems in intermediate states. Observability into saga state is essential.",
  },
];

export function PatternsSection() {
  return (
    <section>
      <h2 id="patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Delivery Guarantees and Messaging Patterns
      </h2>

      <h3 className="text-base font-semibold mt-6 mb-3">Delivery guarantees</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Every messaging system makes a promise about what happens to a message when something
        goes wrong. The guarantee is a trade-off between latency, complexity, and correctness.
        Understanding which guarantee your system provides is the most important operational
        decision when adopting a message broker.
      </p>

      <div className="space-y-3 mb-8">
        {DELIVERY_GUARANTEES.map(({ name, aka, color, behavior, implementation, cost, when }) => (
          <div key={name} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${color}`}>
                {name}
              </span>
              <span className="text-[9px] text-muted-foreground">{aka}</span>
            </div>
            <div className="px-4 py-3 space-y-2 text-[11px]">
              <p><span className="font-medium text-foreground/80">Behavior:</span> <span className="text-muted-foreground">{behavior}</span></p>
              <p><span className="font-medium text-foreground/80">How:</span> <span className="text-muted-foreground">{implementation}</span></p>
              <p><span className="font-medium text-foreground/80">Cost:</span> <span className="text-muted-foreground">{cost}</span></p>
              <p><span className="font-medium text-foreground/80">Use when:</span> <span className="text-muted-foreground">{when}</span></p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-8">
        <p className="text-[13px] text-foreground/70">
          In practice, most teams implement <strong>idempotent at-least-once</strong> delivery and
          call it "effectively exactly-once." The consumer deduplicates using an idempotency key
          (message ID, event UUID). Processing the same message twice produces the same outcome.
          This is simpler and more reliable than true exactly-once semantics.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Messaging patterns</h3>

      <div className="space-y-4">
        {PATTERNS.map(({ name, type, diagram, desc, use, watch }) => (
          <div key={name} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[12px] font-semibold">{name}</span>
              <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                type === "Queue"
                  ? "text-primary bg-primary/10 border-primary/20"
                  : type === "Stream"
                  ? "text-orange-500 bg-orange-400/10 border-orange-400/20"
                  : "text-muted-foreground bg-muted border-border"
              }`}>
                {type}
              </span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <pre className="text-[9px] font-mono bg-muted/40 rounded-lg px-3 py-2 overflow-x-auto text-muted-foreground leading-relaxed whitespace-pre">
                {diagram}
              </pre>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
              <p className="text-[11px]">
                <span className="font-medium text-foreground/80">Use for:</span>{" "}
                <span className="text-muted-foreground">{use}</span>
              </p>
              <p className="text-[11px]">
                <span className="font-medium text-orange-500">Watch out:</span>{" "}
                <span className="text-muted-foreground">{watch}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
