import { WhatIsSection } from "./idempotency/WhatIsSection";
import { WhyItMattersSection } from "./idempotency/WhyItMattersSection";
import { ImplementingSection } from "./idempotency/ImplementingSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-is", title: "What Idempotency Means" },
  { id: "why-it-matters", title: "Why It Matters" },
  { id: "implementing", title: "Implementing It" },
  { id: "summary", title: "Summary" },
];

export default function IdempotencyArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Idempotency solves a specific problem: what happens when your client sends a
          request and never hears back? The network timed out. The server crashed
          mid-request. A proxy dropped the connection. The client cannot tell whether the
          operation succeeded or failed. So it retries. If the operation is not idempotent,
          retrying creates a duplicate.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          This is not a theoretical edge case. Network failures are normal at scale. Message
          queues deliver messages more than once. Distributed systems process operations
          again when servers restart after partial work. Every backend that accepts mutations
          from unreliable clients or unreliable infrastructure needs to handle duplicate
          requests correctly.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article explains what idempotency means, which HTTP methods guarantee it by
          design, and how to add it to operations that are not naturally idempotent, using
          idempotency keys, database UPSERT, and Redis deduplication.
        </p>
      </section>

      <WhatIsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <WhyItMattersSection />
      <ImplementingSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔁",
              label: "Idempotent means same final state on repetition",
              desc: "Not 'no side effects', but 'repeated calls produce the same system state'. DELETE is idempotent: repeatedly deleting an absent resource leaves the system in the same state.",
            },
            {
              icon: "⚠️",
              label: "POST and PATCH are not idempotent by default",
              desc: "POST creates a new resource on each call. PATCH with an increment is additive. These need explicit idempotency added at the application layer.",
            },
            {
              icon: "🔑",
              label: "Idempotency keys are the standard solution",
              desc: "Client generates a UUID and sends it in Idempotency-Key. Server stores the result keyed by that UUID. Retries return the stored result without reprocessing.",
            },
            {
              icon: "🗄️",
              label: "UPSERT prevents duplicate inserts at the database",
              desc: "INSERT ON CONFLICT DO NOTHING is the simplest idempotency mechanism when a natural unique key exists. The database constraint is the last line of defense.",
            },
            {
              icon: "⚡",
              label: "Redis for fast pre-database deduplication",
              desc: "SET NX EX with a TTL catches duplicate requests before they reach the database. Use as a fast path. State is lost on eviction, so it should not be the only guard.",
            },
            {
              icon: "📬",
              label: "Message queues deliver at least once",
              desc: "Kafka, SQS, and RabbitMQ all guarantee at-least-once delivery. Any consumer that creates records or sends messages must be idempotent or use a deduplication store.",
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
