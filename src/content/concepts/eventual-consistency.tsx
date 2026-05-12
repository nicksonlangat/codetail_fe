import { WhatIsSection } from "./eventual-consistency/WhatIsSection";
import { DesigningSection } from "./eventual-consistency/DesigningSection";
import { ConflictsSection } from "./eventual-consistency/ConflictsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-is", title: "Strong vs Eventual Consistency" },
  { id: "designing", title: "Designing for It" },
  { id: "conflicts", title: "Handling Write Conflicts" },
  { id: "summary", title: "Summary" },
];

export default function EventualConsistencyArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Eventual consistency is not a failure mode. It is a design choice that trades
          a brief window of staleness for higher availability and lower write latency.
          Most distributed databases default to it. Most applications are built on top
          of it whether their authors know it or not.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The problems happen when application code assumes strong consistency from a
          system that provides eventual consistency. A user updates their profile and
          immediately sees the old version. A write succeeds on the primary but reads
          from a replica that has not yet caught up. These bugs are intermittent,
          environment-specific, and appear only under certain load patterns.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article explains the difference between strong and eventual consistency,
          identifies the read patterns that cause problems and their targeted fixes, and
          covers how to handle write conflicts when two replicas accept conflicting writes.
        </p>
      </section>

      <WhatIsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <DesigningSection />
      <ConflictsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "⏱️",
              label: "Replication lag is the source of staleness",
              desc: "Writes go to the primary. Replicas receive them asynchronously, with a delay of milliseconds to seconds. A read on a replica during this window returns stale data.",
            },
            {
              icon: "✅",
              label: "Most reads tolerate staleness",
              desc: "Social counters, catalog data, leaderboards, and analytics can all be a few seconds stale without user impact. Identify which reads actually require freshness before adding strong consistency.",
            },
            {
              icon: "👤",
              label: "Read-your-writes: route the user's own reads to primary",
              desc: "After a write, route that user's subsequent reads to the primary for a short window. Prevents the 'my change disappeared' experience without requiring global strong consistency.",
            },
            {
              icon: "🖥️",
              label: "Optimistic UI makes staleness invisible",
              desc: "Update the UI immediately to show the expected result. Sync in the background. Roll back on failure. The user sees instant feedback without waiting for the server.",
            },
            {
              icon: "🔀",
              label: "Last-write-wins is simple but lossy",
              desc: "The most recent timestamp wins in a conflict. Simple to implement. Silently discards the losing write. Clock skew between nodes can cause recent writes to lose.",
            },
            {
              icon: "🏦",
              label: "Some operations require strong consistency",
              desc: "Financial balances, seat and inventory reservation, and unique registration cannot tolerate any staleness or write conflicts. Route these through a single primary with appropriate locking.",
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
