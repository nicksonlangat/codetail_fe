const BASE_PROPS = [
  {
    letter: "BA",
    name: "Basically Available",
    desc: "The system always responds to requests, even if the response contains stale or partial data. Availability is prioritized over correctness in network partition scenarios.",
    contrast: "vs ACID: SQL databases may block or fail a query to preserve consistency.",
  },
  {
    letter: "S",
    name: "Soft state",
    desc: "The state of the system can change over time, even without new input, as replicas converge. The data you read now may differ from the data you read in 100ms.",
    contrast: "vs ACID: Once committed, SQL data is stable — reads return the same value.",
  },
  {
    letter: "E",
    name: "Eventually consistent",
    desc: "Given no new writes, all replicas will eventually converge to the same value. The window of inconsistency is typically milliseconds to seconds, not permanent.",
    contrast: "vs ACID: SQL isolation ensures all clients see the same data at the same time.",
  },
];

const SYSTEMS = [
  { name: "PostgreSQL", model: "ACID", notes: "Full serializable transactions. Row-level locking. WAL-based durability.", highlight: "blue" },
  { name: "MySQL (InnoDB)", model: "ACID", notes: "ACID on the InnoDB engine. MyISAM lacks transaction support.", highlight: "blue" },
  { name: "CockroachDB", model: "ACID", notes: "Distributed ACID via multi-version concurrency control and Raft consensus.", highlight: "blue" },
  { name: "MongoDB", model: "BASE (tunable)", notes: "Eventually consistent by default. Supports multi-document ACID transactions since v4.0.", highlight: "mixed" },
  { name: "Cassandra", model: "BASE", notes: "Tunable consistency levels (ONE, QUORUM, ALL). Trade availability for stronger guarantees.", highlight: "orange" },
  { name: "DynamoDB", model: "BASE (tunable)", notes: "Eventually consistent reads by default. Strongly consistent reads available at higher cost.", highlight: "mixed" },
];

const HIGHLIGHT_STYLES: Record<string, string> = {
  blue: "bg-blue-500/5 border-blue-500/20 text-blue-500",
  mixed: "bg-orange-400/5 border-orange-400/20 text-orange-400",
  orange: "bg-destructive/5 border-destructive/20 text-destructive",
};

export function ACIDvsBaseSection() {
  return (
    <section>
      <h2 id="acid-vs-base" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        ACID vs BASE: Consistency Trade-offs
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        ACID databases prioritize correctness. Every transaction is guaranteed to leave the
        database in a valid, consistent state. NoSQL databases often trade some of that
        correctness for scale and availability, following a model called BASE.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        BASE is not a downgrade from ACID. It is a different set of trade-offs appropriate
        for different workloads. A social media like count does not need ACID guarantees.
        A bank transfer does.
      </p>

      <div className="space-y-2 mb-8">
        {BASE_PROPS.map(({ letter, name, desc, contrast }) => (
          <div key={letter} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
            <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-black text-orange-500 font-mono">{letter}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold mb-1">{name}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-1.5">{desc}</p>
              <p className="text-[10px] text-muted-foreground/60 italic">{contrast}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-8">
        <p className="text-[13px] text-foreground/70">
          The line between ACID and BASE has blurred considerably. MongoDB, DynamoDB, and Cassandra
          all now offer tunable consistency or opt-in transactions. The real question is not
          "SQL or NoSQL" but "what consistency guarantees does this workload require, and at
          what performance cost?"
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Consistency guarantees by system</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Database</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Model</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {SYSTEMS.map(({ name, model, notes, highlight }) => (
              <tr key={name}>
                <td className="py-2 pr-4 font-medium text-foreground/80 align-top whitespace-nowrap">
                  {name}
                </td>
                <td className="py-2 pr-4 align-top">
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${HIGHLIGHT_STYLES[highlight]}`}>
                    {model}
                  </span>
                </td>
                <td className="py-2 text-muted-foreground">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
