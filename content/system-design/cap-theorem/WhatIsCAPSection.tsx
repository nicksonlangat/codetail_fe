const PROPERTIES = [
  {
    letter: "C",
    name: "Consistency",
    color: "text-brand-primary",
    bg: "bg-brand-primary/5 border-brand-primary/20",
    letterBg: "bg-brand-primary/10",
    def: "Every read receives the most recent write, or an error. All nodes see the same data at the same time. A client can never read stale data.",
    note: "This is linearizability, not ACID consistency. It means operations appear instantaneous and in a globally agreed order.",
    example: "You write x=2 to Node A. Any subsequent read from any node returns x=2.",
  },
  {
    letter: "A",
    name: "Availability",
    color: "text-brand-warning",
    bg: "bg-brand-warning/5 border-brand-warning/20",
    letterBg: "bg-brand-warning/10",
    def: "Every request receives a response. Not necessarily the most recent data, but a response without error or timeout. The system never goes silent.",
    note: "Availability in CAP is a strong guarantee: every non-failing node must respond to every request.",
    example: "Node B is isolated from Node A. A read from Node B still returns something (possibly stale).",
  },
  {
    letter: "P",
    name: "Partition Tolerance",
    color: "text-brand-chart-2",
    bg: "bg-brand-chart-2/5 border-brand-chart-2/20",
    letterBg: "bg-brand-chart-2/10",
    def: "The system continues operating even when some nodes cannot communicate with others. Network splits, dropped packets, and node failures are all partition events.",
    note: "In any distributed system running over a real network, partitions happen. Hardware fails. Cables are cut. Cloud availability zones lose connectivity.",
    example: "Node A and Node B cannot reach each other, but both keep running and responding.",
  },
];

export function WhatIsCAPSection() {
  return (
    <section>
      <h2 id="what-is-cap" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Consistency, Availability, Partition Tolerance
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-6">
        The CAP theorem, proved by Eric Brewer and formally by Gilbert and Lynch, states that
        a distributed system can guarantee at most two of three properties. Understanding what
        each property actually means is the prerequisite to understanding the theorem itself.
      </p>

      <div className="space-y-3 mb-8">
        {PROPERTIES.map(({ letter, name, color, bg, letterBg, def, note, example }) => (
          <div key={letter} className={`flex gap-4 p-4 rounded-xl border ${bg}`}>
            <div className={`w-9 h-9 rounded-xl ${letterBg} flex items-center justify-center shrink-0`}>
              <span className={`text-[16px] font-black font-mono ${color}`}>{letter}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-brand-text mb-1">{name}</p>
              <p className="text-[12px] text-brand-text-muted leading-relaxed mb-2">{def}</p>
              <p className="text-[10px] text-brand-text-subtle italic mb-1.5">{note}</p>
              <p className="text-[10px] text-brand-text-muted">
                <span className="font-medium text-brand-text-muted">Example: </span>
                {example}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Why you cannot have all three</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The impossibility argument is straightforward. Consider two nodes, A and B, with a
        network link. You write x=2 to A. The link breaks before A can replicate to B.
        Now a client reads x from B.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-5 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-4">The partition scenario</p>
        <div className="space-y-3 text-[12px]">
          {[
            { step: "1", text: "Client writes x=2 to Node A. Acknowledged.", color: "text-brand-primary" },
            { step: "2", text: "Network link between A and B breaks (partition).", color: "text-brand-destructive" },
            { step: "3", text: "Client reads x from Node B.", color: "text-brand-text/70" },
            { step: "4a", text: "Option A: Node B returns x=1 (stale). Fast but wrong.", color: "text-brand-warning" },
            { step: "4b", text: "Option B: Node B returns an error or waits. Correct but unavailable.", color: "text-brand-primary" },
          ].map(({ step, text, color }) => (
            <div key={step} className="flex gap-3">
              <span className="text-[10px] font-mono text-brand-text-subtle w-6 shrink-0 mt-0.5 text-right">{step}</span>
              <span className={color}>{text}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-brand-text-subtle italic mt-4 border-t border-brand-border/50 pt-3">
          Node B cannot return x=2 without contacting A, which is unreachable.
          There is no third option. This is why C and A are mutually exclusive during a partition.
        </p>
      </div>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          Partition tolerance is not a choice. In any system running over a real network,
          partitions happen. If you choose to drop P, your system must halt completely during
          any partition. No real production system can afford that. The actual choice is always:
          during a partition, sacrifice C or sacrifice A?
        </p>
      </div>
    </section>
  );
}
