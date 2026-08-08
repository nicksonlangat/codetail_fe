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
    contrast: "vs ACID: Once committed, SQL data is stable, reads return the same value.",
  },
  {
    letter: "E",
    name: "Eventually consistent",
    desc: "Given no new writes, all replicas will eventually converge to the same value. The window of inconsistency is typically milliseconds to seconds, not permanent.",
    contrast: "vs ACID: SQL isolation ensures all clients see the same data at the same time.",
  },
];

const SYSTEMS = [
  { name: "PostgreSQL", model: "ACID", notes: "Full serializable transactions. Row-level locking. WAL-based durability.", highlight: "acid" },
  { name: "MySQL (InnoDB)", model: "ACID", notes: "ACID on the InnoDB engine. MyISAM lacks transaction support.", highlight: "acid" },
  { name: "CockroachDB", model: "ACID", notes: "Distributed ACID via multi-version concurrency control and Raft consensus.", highlight: "acid" },
  { name: "MongoDB", model: "BASE (tunable)", notes: "Eventually consistent by default. Supports multi-document ACID transactions since v4.0.", highlight: "tunable" },
  { name: "Cassandra", model: "BASE", notes: "Tunable consistency levels (ONE, QUORUM, ALL). Trade availability for stronger guarantees.", highlight: "base" },
  { name: "DynamoDB", model: "BASE (tunable)", notes: "Eventually consistent reads by default. Strongly consistent reads available at higher cost.", highlight: "tunable" },
];

const HIGHLIGHT_STYLES: Record<string, string> = {
  acid: "bg-brand-primary/5 border-brand-primary/20 text-brand-primary",
  tunable: "bg-brand-warning/5 border-brand-warning/20 text-brand-warning",
  base: "bg-brand-destructive/5 border-brand-destructive/20 text-brand-destructive",
};

export function ACIDvsBaseSection() {
  return (
    <section>
      <h2 id="acid-vs-base" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        ACID vs BASE: Consistency Trade-offs
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        ACID databases prioritize correctness. Every transaction is guaranteed to leave the
        database in a valid, consistent state. NoSQL databases often trade some of that
        correctness for scale and availability, following a model called BASE.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-6">
        BASE is not a downgrade from ACID. It is a different set of trade-offs appropriate
        for different workloads. A social media like count does not need ACID guarantees.
        A bank transfer does.
      </p>

      <div className="space-y-2 mb-8">
        {BASE_PROPS.map(({ letter, name, desc, contrast }) => (
          <div key={letter} className="flex gap-4 p-4 rounded-xl border border-brand-border bg-white">
            <div className="w-8 h-8 rounded-lg bg-brand-warning/10 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-black text-brand-warning font-mono">{letter}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-brand-text mb-1">{name}</p>
              <p className="text-[12px] text-brand-text-muted leading-relaxed mb-1.5">{desc}</p>
              <p className="text-[10px] text-brand-text-subtle italic">{contrast}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-8">
        <p className="text-[13px] text-brand-text-muted">
          The line between ACID and BASE has blurred considerably. MongoDB, DynamoDB, and Cassandra
          all now offer tunable consistency or opt-in transactions. The real question is not
          &quot;SQL or NoSQL&quot; but &quot;what consistency guarantees does this workload require, and at
          what performance cost?&quot;
        </p>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Consistency guarantees by system</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="text-left py-2 pr-4 text-brand-text-muted font-medium">Database</th>
              <th className="text-left py-2 pr-4 text-brand-text-muted font-medium">Model</th>
              <th className="text-left py-2 text-brand-text-muted font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {SYSTEMS.map(({ name, model, notes, highlight }) => (
              <tr key={name}>
                <td className="py-2 pr-4 font-medium text-brand-text/80 align-top whitespace-nowrap">{name}</td>
                <td className="py-2 pr-4 align-top">
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${HIGHLIGHT_STYLES[highlight]}`}>
                    {model}
                  </span>
                </td>
                <td className="py-2 text-brand-text-muted">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
