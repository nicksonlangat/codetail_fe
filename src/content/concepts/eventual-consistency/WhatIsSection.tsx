export function WhatIsSection() {
  return (
    <section>
      <h2 id="what-is" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Strong vs Eventual Consistency
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        With strong consistency, a read always returns the most recent write. Every read
        sees the latest state of the data, regardless of which server handles the request.
        This is what a single-server application gives you by default.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        With eventual consistency, a write is acknowledged immediately, but replicas take
        time to receive it. A read on a replica may return stale data for a window of
        milliseconds to seconds. Eventually — once replication completes — all nodes
        return the same value.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Where replication lag comes from</h3>

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-2.5 border-b border-border bg-muted/30">
          <p className="text-[11px] font-semibold">A write, then a read, during replication lag</p>
        </div>
        <div className="px-4 py-4 space-y-2">
          {[
            { step: "1", text: "User updates their profile photo. POST /users/me writes to the primary database.", bad: false },
            { step: "2", text: "Primary confirms the write. Response: 200 OK.", bad: false },
            { step: "3", text: "User's browser redirects to their profile page. GET /users/me.", bad: false },
            { step: "4", text: "Load balancer routes the GET to a read replica.", bad: false },
            { step: "5", text: "Replication has not completed yet. Replica returns the old photo.", bad: true },
            { step: "6", text: "User sees their previous photo. They refresh. Now the replica has caught up.", bad: false },
          ].map(({ step, text, bad }) => (
            <div key={step} className="flex gap-3 text-[11px]">
              <span className="w-5 h-5 rounded-full bg-secondary text-muted-foreground text-[9px] font-bold flex-shrink-0 flex items-center justify-center">
                {step}
              </span>
              <p className={`mt-0.5 ${bad ? "text-destructive" : "text-muted-foreground"}`}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Why eventual consistency is a deliberate choice</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Strong consistency requires that all replicas agree before a write is acknowledged.
        Under network partition, this means the write either blocks until replicas are
        reachable or is rejected. Availability drops.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Eventual consistency accepts temporary staleness in exchange for availability.
        Writes are always accepted. Replicas catch up asynchronously. For most reads
        in most applications, a value that is a few milliseconds stale is indistinguishable
        from the latest value.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            label: "Strong consistency is correct but limits scale",
            desc: "Every write must be confirmed across replicas before returning. Under partition or high latency, writes stall. Works correctly for any read pattern.",
          },
          {
            label: "Eventual consistency is available but requires care",
            desc: "Writes return immediately. Reads may see stale data for a brief window. The application must be designed to tolerate this — or route specific reads to the primary.",
          },
          {
            label: "Most reads tolerate staleness",
            desc: "A social media like count that is 2 seconds behind is functionally correct. A user's own balance after a transfer is not. The key is identifying which reads require freshness.",
          },
          {
            label: "DNS is the familiar example",
            desc: "A DNS record change propagates globally over minutes to hours. During propagation, different resolvers return different values. The system is eventually consistent by design.",
          },
        ].map(({ label, desc }) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
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
