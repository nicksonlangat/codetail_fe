const CONSISTENCY_LEVELS = [
  {
    name: "Linearizable",
    aka: "Strong consistency",
    desc: "Operations appear instantaneous and globally ordered. Any read after a write returns that write's value, from any node.",
    systems: "etcd, Zookeeper, Spanner, CockroachDB",
    latency: "Highest",
  },
  {
    name: "Sequential consistency",
    aka: null,
    desc: "Operations appear in the same order on all nodes, but the order may lag real time. Writes are globally ordered, just not necessarily in wall-clock order.",
    systems: "Some Redis configurations",
    latency: "High",
  },
  {
    name: "Causal consistency",
    aka: null,
    desc: "Causally related operations are seen in order. If you write A and then B in response to A, any node that sees B will also have seen A. Unrelated operations may be reordered.",
    systems: "MongoDB (causal sessions), COPS",
    latency: "Medium",
  },
  {
    name: "Eventual consistency",
    aka: "BASE",
    desc: "Given no new writes, all nodes will eventually converge to the same value. No ordering guarantee. Reads may return stale data during the convergence window.",
    systems: "Cassandra, DynamoDB, CouchDB, DNS",
    latency: "Lowest",
  },
];

const SYSTEMS = [
  { name: "Zookeeper", cap: "CP", notes: "Raft consensus. Rejects reads/writes during leader election (30-60s). Used for coordination, not storage." },
  { name: "etcd", cap: "CP", notes: "Raft consensus. Guarantees linearizable reads. Unavailable when quorum is lost." },
  { name: "HBase", cap: "CP", notes: "HDFS-backed. Strong consistency via HDFS semantics. Unavailable when HMaster is down." },
  { name: "MongoDB", cap: "CP", notes: "Primary-only writes by default. Read concern majority gives linearizable reads. No primary = no writes." },
  { name: "Redis Sentinel", cap: "CP", notes: "Primary fails: 10-30s election. During election: no writes. Read replicas may lag." },
  { name: "Cassandra", cap: "AP", notes: "Tunable consistency (ONE to ALL). Default is eventual. Always writable, always readable." },
  { name: "CouchDB", cap: "AP", notes: "MVCC-based. Multi-master replication. Conflict resolution is explicit." },
  { name: "DynamoDB", cap: "AP", notes: "Eventually consistent by default. Strongly consistent reads available at 2x the read cost." },
  { name: "Riak", cap: "AP", notes: "Vector clocks, last-write-wins, or CRDT conflict resolution. Designed for availability." },
  { name: "DNS", cap: "AP", notes: "Returns cached responses even when authoritative servers are unreachable. TTL governs staleness." },
];

const CAP_COLORS: Record<string, string> = {
  CP: "bg-primary/10 text-primary border-primary/20",
  AP: "bg-orange-400/10 text-orange-500 border-orange-400/20",
};

export function CPvsAPSection() {
  return (
    <section>
      <h2 id="cp-vs-ap" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        CP vs AP: Real Systems and Consistency Models
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Consistency is not binary. Between "all nodes agree on everything instantly" and
        "nodes may disagree indefinitely" lies a spectrum of models, each offering different
        trade-offs between correctness and performance.
      </p>

      <h3 className="text-base font-semibold mt-6 mb-3">The consistency spectrum</h3>

      <div className="space-y-2 mb-8">
        {CONSISTENCY_LEVELS.map(({ name, aka, desc, systems, latency }) => (
          <div key={name} className="flex gap-4 p-3 rounded-xl border border-border bg-card">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] font-semibold">{name}</span>
                {aka && (
                  <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{aka}</span>
                )}
                <span className="ml-auto text-[9px] font-mono text-muted-foreground">{latency} latency</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-1">{desc}</p>
              <p className="text-[10px] text-muted-foreground/60">
                <span className="font-medium text-foreground/60">Examples: </span>{systems}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Where real systems sit</h3>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">System</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">CAP</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Behavior during partition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {SYSTEMS.map(({ name, cap, notes }) => (
              <tr key={name}>
                <td className="py-2 pr-4 font-medium text-foreground/80 align-top whitespace-nowrap">{name}</td>
                <td className="py-2 pr-4 align-top">
                  <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${CAP_COLORS[cap]}`}>
                    {cap}
                  </span>
                </td>
                <td className="py-2 text-muted-foreground">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          Most modern databases offer tunable consistency. Cassandra lets you set consistency
          per operation (ONE, QUORUM, ALL). DynamoDB lets you request strongly consistent reads.
          MongoDB lets you set read concern and write concern per query. In practice, you mix
          consistency levels within a single application: strong consistency for payments,
          eventual consistency for analytics.
        </p>
      </div>
    </section>
  );
}
