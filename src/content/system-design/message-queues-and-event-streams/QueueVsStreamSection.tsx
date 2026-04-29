import { QueueStreamVisualizer } from "@/components/blog/interactive/queue-stream-visualizer";

const COMPARISON_ROWS = [
  { property: "Message retention", queue: "Deleted after consumption", stream: "Retained (configurable TTL)" },
  { property: "Consumer model", queue: "Competing consumers (one gets each)", stream: "Consumer groups with independent offsets" },
  { property: "Replay", queue: "Not possible — message gone", stream: "Yes — rewind offset to any point" },
  { property: "Ordering", queue: "FIFO within a queue", stream: "Strict order within a partition" },
  { property: "Scaling reads", queue: "Add consumers to the same queue", stream: "Add consumer groups (each reads all)" },
  { property: "Delivery guarantee", queue: "At-least-once (ack-based)", stream: "At-least-once; exactly-once with transactions" },
  { property: "Backpressure", queue: "Queue depth builds; reject or block", stream: "Consumers lag behind; lag is observable" },
  { property: "Primary use", queue: "Task distribution, job queues", stream: "Event sourcing, audit logs, stream processing" },
];

const SYSTEMS = [
  {
    name: "RabbitMQ",
    type: "Queue",
    protocol: "AMQP",
    best: "Task queues, work distribution, request routing via exchange bindings",
    notes: "Flexible routing via exchanges (direct, fanout, topic, headers). Messages TTL and DLQ built in.",
  },
  {
    name: "Amazon SQS",
    type: "Queue",
    protocol: "HTTP/HTTPS",
    best: "Managed task queue, serverless workers, Lambda triggers",
    notes: "Standard (at-least-once, best-effort ordering) and FIFO (exactly-once, strict order) queues.",
  },
  {
    name: "Apache Kafka",
    type: "Stream",
    protocol: "Kafka binary / TCP",
    best: "Event sourcing, real-time pipelines, audit logs, analytics",
    notes: "Partitioned log. Messages retained on disk. Consumer groups each get full copy. Millions of events/sec.",
  },
  {
    name: "Google Pub/Sub",
    type: "Queue + Stream",
    protocol: "HTTP/gRPC",
    best: "Managed messaging for GCP workloads, push to Cloud Functions",
    notes: "Managed service. At-least-once delivery. Seek to timestamp for replay. Simple ops story.",
  },
  {
    name: "Amazon Kinesis",
    type: "Stream",
    protocol: "HTTP/HTTPS",
    best: "Real-time analytics, log aggregation on AWS",
    notes: "Sharded stream. 24-hour default retention (7-day extended). Tight AWS integration.",
  },
  {
    name: "Redis Streams",
    type: "Stream",
    protocol: "RESP / TCP",
    best: "Low-latency streams when Redis is already in the stack",
    notes: "Consumer groups with offset tracking. Not a Kafka replacement at volume, but operationally simple.",
  },
];

export function QueueVsStreamSection() {
  return (
    <section>
      <h2 id="queue-vs-stream" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Queue vs Stream: Two Different Primitives
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The terms "message queue" and "event stream" are often used interchangeably, but they
        represent fundamentally different primitives. A queue is a work distribution mechanism:
        each message is a task to be done by exactly one worker. A stream is an immutable,
        ordered log: each message is a fact that any number of consumers can read independently,
        now or in the future.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The key behavioral difference is what happens to a message after it is read. In a queue,
        the consumer acknowledges it and the message is deleted. In a stream, the message stays
        on disk. The consumer advances its offset. Other consumers have their own offsets and
        read the same message at their own pace. A new consumer can replay the entire history
        from offset zero.
      </p>

      <QueueStreamVisualizer />

      <h3 className="text-base font-semibold mt-4 mb-3">Property comparison</h3>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Property</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Queue</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Stream</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {COMPARISON_ROWS.map(({ property, queue, stream }) => (
              <tr key={property}>
                <td className="py-2.5 pr-4 font-medium text-foreground/80 align-top">{property}</td>
                <td className="py-2.5 pr-4 text-muted-foreground align-top">{queue}</td>
                <td className="py-2.5 text-muted-foreground align-top">{stream}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Real systems</h3>

      <div className="space-y-2 mb-6">
        {SYSTEMS.map(({ name, type, protocol, best, notes }) => (
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
              <span className="ml-auto text-[9px] font-mono text-muted-foreground">{protocol}</span>
            </div>
            <div className="px-4 py-3 space-y-1">
              <p className="text-[11px] text-foreground/80"><span className="font-medium">Best for:</span> {best}</p>
              <p className="text-[11px] text-muted-foreground">{notes}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
