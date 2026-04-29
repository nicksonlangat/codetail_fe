import { WhyQueuesSection } from "./message-queues-and-event-streams/WhyQueuesSection";
import { QueueVsStreamSection } from "./message-queues-and-event-streams/QueueVsStreamSection";
import { PatternsSection } from "./message-queues-and-event-streams/PatternsSection";
import { ChoosingSection } from "./message-queues-and-event-streams/ChoosingSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "why-queues", title: "The Coupling Problem" },
  { id: "queue-vs-stream", title: "Queue vs Stream" },
  { id: "patterns", title: "Delivery Guarantees and Patterns" },
  { id: "choosing", title: "Choosing a Messaging System" },
  { id: "summary", title: "Summary" },
];

export default function MessageQueuesArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A message queue is a buffer between two services that allows them to communicate
          without being directly connected. The producer writes a message and returns
          immediately. The consumer reads and processes it when it is ready. The broker in
          between absorbs the difference in pace, handles failures, and guarantees delivery
          according to a configured policy.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Event streams extend this idea. Instead of a queue where messages disappear after
          consumption, a stream is an append-only, ordered log. Messages are retained on disk.
          Each consumer group tracks its own position (offset) in the log. New consumers can
          replay the entire history. The log becomes the source of truth.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          Understanding which primitive fits your problem determines whether you reach for
          RabbitMQ, SQS, or Kafka. The wrong choice costs months of fighting the tool. This
          article explains the coupling problem queues solve, the behavioral difference between
          queues and streams, the delivery guarantees and messaging patterns you need to know,
          and how to pick the right system for your workload.
        </p>
      </section>

      <WhyQueuesSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <QueueVsStreamSection />
      <PatternsSection />
      <ChoosingSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔗",
              label: "Queues decouple producers from consumers",
              desc: "Producer publishes and returns immediately. Consumer processes when ready. Neither knows about the other. Failures in one do not cascade to the other.",
            },
            {
              icon: "🗑️",
              label: "Queue: consumed and deleted",
              desc: "Each message goes to one consumer then disappears. Competing consumers share the load. Scale by adding consumer instances. Use for task distribution.",
            },
            {
              icon: "📜",
              label: "Stream: retained and replayable",
              desc: "Messages are appended to an ordered log and kept on disk. Each consumer group has its own offset. New consumers can replay history from the beginning.",
            },
            {
              icon: "🔁",
              label: "At-least-once is the practical default",
              desc: "At-most-once loses messages. Exactly-once is complex. Design consumers to be idempotent and use at-least-once delivery. Duplicates handled by idempotency keys.",
            },
            {
              icon: "📬",
              label: "Dead-letter queues catch poison messages",
              desc: "Every production queue needs a DLQ. Messages that fail N retries go there instead of looping forever. Alerts on DLQ depth. Replay after fixing the bug.",
            },
            {
              icon: "📊",
              label: "Consumer lag is the primary Kafka health metric",
              desc: "Lag measures how far behind the latest offset a consumer is. Growing lag means consumers are slower than producers. It is the first signal of a processing problem.",
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
