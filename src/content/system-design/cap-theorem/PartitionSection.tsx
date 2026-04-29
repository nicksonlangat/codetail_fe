import { PartitionSimulator } from "@/components/blog/interactive/partition-simulator";

export function PartitionSection() {
  return (
    <section>
      <h2 id="partition-simulation" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Simulating a Network Partition
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The simulator below shows two database nodes with a shared variable x.
        Use it to explore how CP and AP systems behave differently when the network
        link is severed.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Start by writing a few values with the network connected. Then partition the
        network and try writing again. Switch between CP and AP modes to see the
        different responses. Finally, heal the network to watch AP reconciliation happen.
      </p>

      <PartitionSimulator />

      <div className="grid gap-3 sm:grid-cols-2 mt-2">
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">CP</span>
            <span className="text-[12px] font-semibold">Consistency over Availability</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
            Writes are rejected during a partition. Every read returns the latest confirmed
            value. No client ever sees stale data. The cost: your service is partially
            unavailable while the partition lasts.
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            <span className="font-medium text-foreground/70">Real systems: </span>
            Zookeeper, etcd, HBase, Redis (Sentinel mode), MongoDB (primary-only reads)
          </p>
        </div>
        <div className="p-4 rounded-xl border border-orange-400/20 bg-orange-400/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-semibold bg-orange-400/10 text-orange-500 px-2 py-0.5 rounded">AP</span>
            <span className="text-[12px] font-semibold">Availability over Consistency</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
            Writes succeed on any reachable node. The system always responds. The cost:
            nodes diverge during a partition, and stale data is served to clients until
            the network heals and reconciliation runs.
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            <span className="font-medium text-foreground/70">Real systems: </span>
            Cassandra, CouchDB, DynamoDB (eventual), Riak, DNS
          </p>
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Reconciliation in AP systems</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When the partition heals, AP systems must reconcile diverged state. Different systems
        use different strategies to resolve conflicts between nodes that both accepted writes.
      </p>

      <div className="space-y-2">
        {[
          {
            strategy: "Last-write-wins (LWW)",
            desc: "Each write is timestamped. The write with the highest timestamp wins. Simple but requires synchronized clocks. Clock skew can cause newer writes to be discarded.",
            used: "Cassandra (default), DynamoDB",
          },
          {
            strategy: "Vector clocks",
            desc: "Each write carries a vector of version numbers, one per node. Conflicts are detected by comparing vectors. The application or user resolves genuine conflicts.",
            used: "Riak, Amazon Dynamo (original)",
          },
          {
            strategy: "CRDTs (Conflict-free Replicated Data Types)",
            desc: "Data structures designed so concurrent updates always merge without conflict. A counter that only increments, a set that only adds: these can merge automatically.",
            used: "Riak (counters, sets), Redis (some structures)",
          },
          {
            strategy: "Multi-version concurrency control (MVCC)",
            desc: "Every write creates a new version. Diverged branches are preserved as multiple versions. The application can see the conflict and resolve it explicitly.",
            used: "CouchDB, PostgreSQL (for ACID isolation)",
          },
        ].map(({ strategy, desc, used }) => (
          <div key={strategy} className="p-3 rounded-xl border border-border bg-card text-[11px]">
            <p className="font-semibold mb-1">{strategy}</p>
            <p className="text-muted-foreground leading-relaxed mb-1.5">{desc}</p>
            <p className="text-[10px] text-muted-foreground/60">
              <span className="font-medium text-foreground/60">Used by: </span>{used}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
