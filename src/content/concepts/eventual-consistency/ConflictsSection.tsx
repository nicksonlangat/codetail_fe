export function ConflictsSection() {
  return (
    <section>
      <h2 id="conflicts" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Handling Write Conflicts
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        In a multi-primary or multi-region setup, two nodes can both accept writes to
        the same record while partitioned from each other. When the partition heals and
        they reconcile, they hold conflicting values. The system must decide which value
        wins — or how to merge them.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        This is distinct from replication lag. Replication lag is a read seeing an old
        value. Write conflicts are two concurrent writes to the same record that cannot
        both be correct.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Last-write-wins</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The simplest conflict resolution strategy: each write carries a timestamp, and
        the write with the latest timestamp wins. The other write is silently discarded.
        Cassandra uses last-write-wins by default.
      </p>

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="px-4 py-3">
            <p className="text-[9px] uppercase tracking-wider text-primary mb-1">Advantage</p>
            <p className="text-[11px] text-muted-foreground">Simple to implement. No merge logic required. Convergence is guaranteed: all nodes eventually agree on the same value.</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[9px] uppercase tracking-wider text-destructive mb-1">Risk</p>
            <p className="text-[11px] text-muted-foreground">Data loss. The losing write is discarded silently. Clock skew between nodes can cause recent writes to lose to older ones if clocks drift.</p>
          </div>
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Operations that merge cleanly</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Some operations are commutative and associative: applying them in any order
        produces the same result. These can be merged without conflict.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {[
          {
            label: "Counters",
            desc: 'Two increments of +1 on the same counter can always be merged: apply both. The result is +2 regardless of order. Use "G-counter" (grow-only counter) CRDT semantics.',
            safe: true,
          },
          {
            label: "Set membership (add-only)",
            desc: "Adding a tag to a post on two different nodes can always be merged: include both additions. Add-wins semantics: if it was added on any replica, it is present.",
            safe: true,
          },
          {
            label: "Set membership (with removes)",
            desc: 'If node A removes a tag while node B adds the same tag concurrently, both operations cannot be correct. Add-wins or remove-wins must be chosen. There is no "correct" answer.',
            safe: false,
          },
          {
            label: "Setting a field to a value",
            desc: 'If node A sets email to "a@x.com" and node B sets it to "b@x.com" concurrently, only one can be correct. This is not a mergeable operation.',
            safe: false,
          },
        ].map(({ label, desc, safe }) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className={`text-sm flex-shrink-0 mt-0.5 font-bold ${safe ? "text-primary" : "text-destructive"}`}>
              {safe ? "✓" : "✗"}
            </span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{label}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">When to use strong consistency instead</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Eventual consistency is a tool, not a default. Some operations require strong
        consistency regardless of the availability cost. If the data cannot tolerate
        any staleness or conflict, route those operations to a single primary.
      </p>

      <div className="space-y-2">
        {[
          {
            case: "Financial transactions",
            reason: "A balance that is a few seconds stale can allow an overdraft. All reads and writes to account balances must go through a single authoritative source.",
          },
          {
            case: "Seat and inventory reservation",
            reason: "Two nodes accepting the last seat to different users creates a conflict that cannot be resolved without a customer-facing correction. Prevent it with a lock.",
          },
          {
            case: "Unique username or email registration",
            reason: "Two nodes accepting the same username for different users in parallel creates a conflict. A database unique constraint on a single primary prevents it.",
          },
        ].map(({ case: c, reason }) => (
          <div key={c} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{c}</p>
              <p className="text-[11px] text-muted-foreground">{reason}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
