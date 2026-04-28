const DECISION_ROWS = [
  {
    signal: "Task/job queue — one worker per message",
    rabbitmq: "best",
    sqs: "best",
    kafka: "ok",
    notes: "RabbitMQ and SQS are purpose-built for work distribution. Kafka works but is heavyweight for simple task queues.",
  },
  {
    signal: "Event sourcing — replay from any offset",
    rabbitmq: "poor",
    sqs: "poor",
    kafka: "best",
    notes: "Kafka's retained, ordered log is the natural fit. RabbitMQ and SQS delete messages on consumption.",
  },
  {
    signal: "Many consumers reading same events independently",
    rabbitmq: "ok",
    sqs: "poor",
    kafka: "best",
    notes: "Kafka consumer groups each get a full copy. SQS requires separate queues per consumer. RabbitMQ fanout exchange duplicates messages.",
  },
  {
    signal: "Sub-millisecond latency, low throughput",
    rabbitmq: "best",
    sqs: "poor",
    kafka: "ok",
    notes: "RabbitMQ delivers in-memory messages with sub-ms latency. SQS has ~1ms+ HTTP overhead. Kafka optimizes for throughput, not latency.",
  },
  {
    signal: "Millions of events per second",
    rabbitmq: "poor",
    sqs: "ok",
    kafka: "best",
    notes: "Kafka's partitioned log and batch compression handle extreme throughput. RabbitMQ saturates around tens of thousands/sec per queue.",
  },
  {
    signal: "Complex routing (topic, header, binding rules)",
    rabbitmq: "best",
    sqs: "poor",
    kafka: "ok",
    notes: "RabbitMQ exchange types (direct, topic, fanout, headers) handle sophisticated routing natively. Kafka routing is by topic/partition only.",
  },
  {
    signal: "Fully managed, zero ops overhead",
    rabbitmq: "poor",
    sqs: "best",
    kafka: "ok",
    notes: "SQS is serverless and infinitely scalable with zero management. RabbitMQ requires cluster ops. MSK and Confluent Cloud manage Kafka.",
  },
  {
    signal: "Strict FIFO ordering with deduplication",
    rabbitmq: "ok",
    sqs: "best",
    kafka: "ok",
    notes: "SQS FIFO queues guarantee ordering and deduplication. Kafka guarantees order per partition. RabbitMQ FIFO is per-queue, not globally ordered.",
  },
  {
    signal: "Long-term audit log / compliance",
    rabbitmq: "poor",
    sqs: "poor",
    kafka: "best",
    notes: "Kafka can retain messages indefinitely (log compaction or infinite retention). SQS max 14 days. RabbitMQ deletes on ack.",
  },
  {
    signal: "Already on AWS, need Lambda triggers",
    rabbitmq: "poor",
    sqs: "best",
    kafka: "ok",
    notes: "SQS + Lambda is first-class AWS. MSK (Kafka) also has Lambda trigger support but more complex setup.",
  },
];

const SCORE_STYLE: Record<string, string> = {
  best: "text-primary bg-primary/10 border-primary/20",
  ok: "text-muted-foreground bg-muted border-border",
  poor: "text-orange-500 bg-orange-400/10 border-orange-400/20",
};

const SCORE_LABEL: Record<string, string> = {
  best: "best fit",
  ok: "workable",
  poor: "avoid",
};

const OPERATIONAL_COSTS = [
  {
    system: "RabbitMQ",
    setup: "Medium — cluster needs quorum nodes",
    monitoring: "Queue depth, consumer count, unrouted messages, connection count",
    failure: "Node failure in cluster handled by quorum. Single-node: manual recovery.",
    scaling: "Vertical (bigger nodes) or sharding (multiple clusters). Horizontal is complex.",
  },
  {
    system: "SQS",
    setup: "Zero — fully managed",
    monitoring: "ApproximateNumberOfMessagesVisible (depth), NumberOfMessagesSent/Deleted",
    failure: "AWS handles it. 99.9% SLA. No cluster ops.",
    scaling: "Infinite. Scales automatically. Cost scales with messages, not infra.",
  },
  {
    system: "Kafka",
    setup: "High — ZooKeeper (or KRaft), broker fleet, partition strategy required",
    monitoring: "Consumer lag per topic/partition is the critical metric. Under-replicated partitions, ISR, disk utilization.",
    failure: "Partition leader election on broker failure (seconds). No data loss if replication factor >= 2.",
    scaling: "Add brokers + rebalance partitions. Horizontal scaling is a core design feature.",
  },
];

export function ChoosingSection() {
  return (
    <section>
      <h2 id="choosing" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Choosing a Messaging System
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        RabbitMQ, SQS, and Kafka serve different primary use cases. RabbitMQ is a message broker
        with flexible routing. SQS is a fully managed queue optimized for simple AWS workloads.
        Kafka is a distributed log built for high-throughput streaming and event sourcing.
        Choosing the wrong one creates operational friction that compounds over time.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Decision matrix</h3>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Signal</th>
              <th className="text-left py-2 pr-2 text-muted-foreground font-medium">RabbitMQ</th>
              <th className="text-left py-2 pr-2 text-muted-foreground font-medium">SQS</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Kafka</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {DECISION_ROWS.map(({ signal, rabbitmq, sqs, kafka, notes }) => (
              <tr key={signal}>
                <td className="py-2.5 pr-4 text-foreground/80 align-top">{signal}</td>
                {[rabbitmq, sqs, kafka].map((score, i) => (
                  <td key={i} className="py-2.5 pr-2 align-top">
                    <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap ${SCORE_STYLE[score]}`}>
                      {SCORE_LABEL[score]}
                    </span>
                  </td>
                ))}
                <td className="py-2.5 text-muted-foreground align-top">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Operational cost</h3>

      <div className="space-y-3 mb-8">
        {OPERATIONAL_COSTS.map(({ system, setup, monitoring, failure, scaling }) => (
          <div key={system} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[12px] font-semibold">{system}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 px-4 py-3 text-[11px]">
              <p><span className="font-medium text-foreground/80">Setup:</span> <span className="text-muted-foreground">{setup}</span></p>
              <p><span className="font-medium text-foreground/80">Scaling:</span> <span className="text-muted-foreground">{scaling}</span></p>
              <p><span className="font-medium text-foreground/80">Monitor:</span> <span className="text-muted-foreground">{monitoring}</span></p>
              <p><span className="font-medium text-foreground/80">Failure:</span> <span className="text-muted-foreground">{failure}</span></p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Rules of thumb</h3>

      <div className="space-y-2">
        {[
          {
            rule: "Start with SQS if you are on AWS and need a task queue",
            detail: "Zero setup, infinite scale, pay per message. Add SNS as a fanout layer when you need pub/sub. The managed ops story is unbeatable for most teams.",
          },
          {
            rule: "Use RabbitMQ when you need rich routing logic",
            detail: "Topic exchanges, header-based routing, priority queues, and dead-lettering are first-class features. No Kafka partition planning required.",
          },
          {
            rule: "Use Kafka when messages are facts, not tasks",
            detail: "If you need replay, audit log, stream processing, or multiple independent consumers reading the same events, Kafka's retained log is the right model.",
          },
          {
            rule: "Design consumers to be idempotent from day one",
            detail: "At-least-once delivery is the practical default for every system. Duplicate messages will arrive. Build consumers that handle them gracefully using idempotency keys.",
          },
          {
            rule: "Monitor consumer lag, not just queue depth",
            detail: "In Kafka, lag (how far behind the latest offset a consumer is) is the primary health signal. A consumer that is always caught up is healthy. Growing lag is an incident.",
          },
          {
            rule: "Every queue needs a dead-letter queue",
            detail: "Without a DLQ, poison messages either loop forever (burning CPU) or block the queue. A DLQ catches failures, alerts engineers, and enables replay after the bug is fixed.",
          },
        ].map(({ rule, detail }) => (
          <div key={rule} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{rule}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
