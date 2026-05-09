const READ_PATTERNS = [
  {
    pattern: "Read-your-writes",
    problem:
      "User writes data, then immediately reads it. Their read is routed to a stale replica. They see their own change disappear.",
    solution:
      "After a write, route that user's subsequent reads to the primary for a short window (e.g. 5 seconds), or use a sticky session that pins them to the primary for the rest of their session.",
    example: "Profile update, settings change, posting a comment.",
  },
  {
    pattern: "Monotonic reads",
    problem:
      "User refreshes a page and sees data that is older than the previous refresh. Load balancer sent two consecutive requests to replicas at different replication positions.",
    solution:
      "Pin the user to a specific replica for the duration of a session, or include a replication token in the request so the database can confirm it has seen at least that state.",
    example: "Paginating through a list that has items inserted in real-time.",
  },
  {
    pattern: "Consistent prefix reads",
    problem:
      "In a write sequence (A then B), a reader may see B before A. The replica received and applied them in a different order.",
    solution:
      "Ensure writes from a single writer go to a single replica shard, preserving causal order within that writer's stream.",
    example: "Multi-step form wizard where each step writes a field.",
  },
];

export function DesigningSection() {
  return (
    <section>
      <h2 id="designing" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Designing for Eventual Consistency
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Most staleness problems are not random — they follow predictable patterns that
        have known solutions. The first step is identifying which reads in your application
        actually need freshness. The second step is applying a targeted fix to those reads
        without paying the cost of strong consistency everywhere.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Common staleness patterns and fixes</h3>

      <div className="space-y-3 mb-8">
        {READ_PATTERNS.map(({ pattern, problem, solution, example }) => (
          <div key={pattern} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[11px] font-semibold">{pattern}</p>
            </div>
            <div className="px-4 py-3 space-y-1.5 text-[11px]">
              <p><span className="font-medium text-destructive">Problem: </span><span className="text-muted-foreground">{problem}</span></p>
              <p><span className="font-medium text-primary">Fix: </span><span className="text-muted-foreground">{solution}</span></p>
              <p><span className="font-medium text-foreground/60">Example: </span><span className="text-muted-foreground">{example}</span></p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">When staleness is acceptable</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Not all reads need to be fresh. For a large class of reads, a value that is a
        few seconds stale is functionally identical to the current value. Identifying these
        reads and explicitly allowing staleness reduces the load on the primary.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {[
          { type: "Acceptable staleness", items: ["Social counters (likes, views, followers)", "Catalog and product listings", "Public leaderboards and rankings", "Search index results", "Analytics dashboards"] },
          { type: "Freshness required", items: ["User's own balance after a transfer", "Seat / inventory after booking", "User's own recent activity", "Auth tokens and sessions", "Payment status"] },
        ].map(({ type, items }) => (
          <div key={type} className="bg-card border border-border rounded-xl p-4">
            <p className="text-[11px] font-semibold mb-3">{type}</p>
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li key={item} className="flex gap-2 text-[11px] text-muted-foreground">
                  <span className="text-primary mt-0.5 flex-shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Optimistic UI</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The optimistic UI pattern sidesteps staleness from the user's perspective without
        requiring strong consistency. The UI updates immediately to show the expected result
        of a write, then syncs with the server in the background. If the write fails, the
        UI rolls back.
      </p>

      <div className="space-y-2">
        {[
          {
            action: "User likes a post",
            optimistic: "Like count increments instantly in the UI. POST /likes fires in the background.",
            rollback: "If the POST fails (rate limit, network error), the like count decrements and shows an error.",
          },
          {
            action: "User reorders items in a list",
            optimistic: "New order is reflected in the UI immediately. PATCH /order fires asynchronously.",
            rollback: "If the PATCH fails, the previous order is restored from the last known server state.",
          },
        ].map(({ action, optimistic, rollback }) => (
          <div key={action} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[11px] font-semibold">{action}</p>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
              <div className="px-4 py-3">
                <p className="text-[9px] uppercase tracking-wider text-primary mb-1">Optimistic</p>
                <p className="text-[11px] text-muted-foreground">{optimistic}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[9px] uppercase tracking-wider text-orange-500 mb-1">Rollback on failure</p>
                <p className="text-[11px] text-muted-foreground">{rollback}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
