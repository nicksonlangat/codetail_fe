const PACELC_SYSTEMS = [
  {
    name: "DynamoDB",
    partition: "AP",
    else_: "EL",
    desc: "Chooses availability during partitions. Normally favors low latency over strong consistency.",
    full: "PA/EL",
  },
  {
    name: "Cassandra",
    partition: "AP",
    else_: "EL",
    desc: "Always available. Tunable consistency but defaults to low latency.",
    full: "PA/EL",
  },
  {
    name: "Spanner",
    partition: "CP",
    else_: "EC",
    desc: "Chooses consistency during partitions. TrueTime protocol achieves external consistency globally.",
    full: "PC/EC",
  },
  {
    name: "CockroachDB",
    partition: "CP",
    else_: "EC",
    desc: "Serializable transactions with global consistency. Latency trades for correctness.",
    full: "PC/EC",
  },
  {
    name: "MongoDB (majority)",
    partition: "CP",
    else_: "EC",
    desc: "With majority read/write concern, strongly consistent. Latency cost on each write.",
    full: "PC/EC",
  },
  {
    name: "Riak",
    partition: "AP",
    else_: "EL",
    desc: "Designed for availability. Multi-master replication. Eventual consistency by design.",
    full: "PA/EL",
  },
];

export function BeyondCAPSection() {
  return (
    <section>
      <h2 id="beyond-cap" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Beyond CAP: PACELC and Practical Guidance
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        CAP is often misapplied because it only applies during network partitions, which are
        relatively rare events. Most of the time, your distributed system is operating normally
        with all nodes connected. During normal operation, there is a different fundamental
        trade-off: consistency versus latency.
      </p>

      <h3 className="text-base font-semibold mt-6 mb-3">The PACELC model</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        PACELC extends CAP to cover both cases. During a Partition (P), you choose Availability (A)
        or Consistency (C). Else (E), during normal operation, you choose Latency (L) or
        Consistency (C).
      </p>

      <div className="bg-card border border-border rounded-xl p-5 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-4">
          PACELC framework
        </p>
        <div className="grid sm:grid-cols-2 gap-4 text-[11px]">
          <div className="p-3 rounded-xl bg-muted space-y-2">
            <p className="font-semibold text-[12px]">During a Partition (P)</p>
            <p className="text-muted-foreground">
              Same as CAP: choose between Availability (A) or Consistency (C).
              Most systems must sacrifice one when nodes cannot communicate.
            </p>
            <div className="flex gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">PA: serve stale</span>
              <span className="px-2 py-0.5 rounded bg-orange-400/10 text-orange-500 font-mono">PC: reject writes</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-muted space-y-2">
            <p className="font-semibold text-[12px]">Else: during Normal Operation (E)</p>
            <p className="text-muted-foreground">
              Even without partitions, replicating writes to multiple nodes takes time.
              Choose: respond fast with possibly stale data, or wait for confirmation.
            </p>
            <div className="flex gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">EL: fast, may lag</span>
              <span className="px-2 py-0.5 rounded bg-orange-400/10 text-orange-500 font-mono">EC: slow, always fresh</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">System</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">PACELC</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Trade-off in plain terms</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {PACELC_SYSTEMS.map(({ name, full, desc }) => (
              <tr key={name}>
                <td className="py-2 pr-4 font-medium text-foreground/80 align-top whitespace-nowrap">{name}</td>
                <td className="py-2 pr-4 align-top">
                  <span className="text-[9px] font-mono font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {full}
                  </span>
                </td>
                <td className="py-2 text-muted-foreground">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Practical guidance</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            label: "Use strong consistency for writes that matter",
            desc: "Financial transactions, inventory updates, authentication state. The cost is latency, not correctness. Pay it where it counts.",
          },
          {
            label: "Use eventual consistency for reads that tolerate lag",
            desc: "Analytics dashboards, activity feeds, recommendation counters. A like count that is 2 seconds stale is not a problem.",
          },
          {
            label: "Do not treat CAP as the only model",
            desc: "PACELC reminds you the latency-consistency trade-off exists at all times, not just during the rare partition event. Most performance problems are PACELC problems.",
          },
          {
            label: "Tune consistency per operation, not per system",
            desc: "Cassandra, DynamoDB, and MongoDB all support per-request consistency levels. Use QUORUM for writes, ONE for non-critical reads. Mix within the same application.",
          },
        ].map(({ label, desc }) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">✓</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{label}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
