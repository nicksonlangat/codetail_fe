import { WhatIsCAPSection } from "./cap-theorem/WhatIsCAPSection";
import { PartitionSection } from "./cap-theorem/PartitionSection";
import { CPvsAPSection } from "./cap-theorem/CPvsAPSection";
import { BeyondCAPSection } from "./cap-theorem/BeyondCAPSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-is-cap", title: "Consistency, Availability, Partition Tolerance" },
  { id: "partition-simulation", title: "Simulating a Network Partition" },
  { id: "cp-vs-ap", title: "CP vs AP: Real Systems" },
  { id: "beyond-cap", title: "Beyond CAP: PACELC" },
  { id: "summary", title: "Summary" },
];

export default function CAPTheoremArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Every distributed system makes a promise about what happens when nodes cannot
          talk to each other. The CAP theorem tells you there are only two promises you
          can keep during a network partition: either your system remains consistent and
          rejects requests it cannot fulfill, or it remains available and accepts requests
          it cannot fully coordinate. It cannot do both.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The theorem is often cited and rarely understood. Its most common misreading is
          treating it as a design choice between three properties when it is actually a
          choice between two, because partition tolerance is non-negotiable in any real
          distributed system. The practical question is always: consistency or availability
          during a partition?
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article explains what each property means precisely, simulates a partition
          so you can observe CP and AP behavior directly, maps real databases to their
          CAP positions, and introduces PACELC: the more complete model that covers both
          partition and normal-operation trade-offs.
        </p>
      </section>

      <WhatIsCAPSection />
      <PartitionSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <CPvsAPSection />
      <BeyondCAPSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔺",
              label: "Partition tolerance is not optional",
              desc: "Network partitions happen in any distributed system. Choosing to drop P means your system halts during any partition. In practice, all distributed systems must tolerate partitions.",
            },
            {
              icon: "⚖️",
              label: "CP: reject writes, preserve consistency",
              desc: "During a partition, CP systems refuse requests they cannot coordinate. No client ever reads stale data. The cost: partial unavailability while the partition lasts.",
            },
            {
              icon: "📡",
              label: "AP: accept writes, tolerate divergence",
              desc: "During a partition, AP systems accept writes on any reachable node. The system always responds. The cost: nodes diverge and reconciliation is needed after healing.",
            },
            {
              icon: "🔧",
              label: "Reconciliation strategies matter",
              desc: "Last-write-wins is simple but can lose data. Vector clocks detect conflicts. CRDTs merge without conflict. Choose based on what your data allows.",
            },
            {
              icon: "📐",
              label: "PACELC extends CAP beyond partitions",
              desc: "Even without partitions, replicating writes takes time. The real trade-off is always latency vs consistency, not just during rare partition events.",
            },
            {
              icon: "🎛️",
              label: "Tune per operation, not per system",
              desc: "Strong consistency for payments, eventual consistency for feeds. Most modern databases support per-request consistency levels. Mix them within one application.",
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
