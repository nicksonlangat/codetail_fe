import { ScalabilitySimulator } from "@/components/blog/interactive/scalability-simulator";

export function LoadBalancerSection() {
  return (
    <section>
      <h2 id="load-balancer-algorithms" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Load Balancer Algorithms
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A load balancer is only as good as its distribution algorithm. The right choice depends on
        whether your servers are homogeneous, whether requests have varying costs, and whether users
        need to be pinned to a specific server.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            name: "Round Robin",
            icon: "🔄",
            desc: "Routes requests in sequence: Server 1, Server 2, Server 3, Server 1... Equal distribution by count, not by load. Simple and effective when requests have similar cost.",
            best: "Homogeneous servers, similar request cost",
            worst: "Expensive requests (some servers get unlucky runs)",
          },
          {
            name: "Least Connections",
            icon: "📊",
            desc: "Routes to the server with the fewest active connections. Naturally adapts to servers handling slow requests — faster servers accept more connections as they complete work.",
            best: "Variable request duration, long-lived connections",
            worst: "Very short requests (overhead of counting outweighs benefit)",
          },
          {
            name: "IP Hash",
            icon: "🔑",
            desc: "Hashes the client's IP to consistently route them to the same server. A poor man's sticky sessions — no cookie required. Breaks if server count changes (consistent hashing fixes this).",
            best: "Stateful apps needing session affinity",
            worst: "Uneven traffic (hot IPs = hot servers)",
          },
          {
            name: "Weighted Round Robin",
            icon: "⚖️",
            desc: "Like Round Robin, but servers with higher weight receive proportionally more requests. Useful when servers have different hardware specs — a 16-core server gets 2× the traffic of an 8-core one.",
            best: "Heterogeneous server fleet",
            worst: "Dynamic environments where server capacity changes",
          },
          {
            name: "Random",
            icon: "🎲",
            desc: "Picks a server at random. Surprisingly effective at scale — by the law of large numbers, distribution converges to even. Simpler to implement than Round Robin with similar results.",
            best: "Simple setups, large server counts",
            worst: "Small server counts (statistical variance matters)",
          },
        ].map(({ name, icon, desc, best, worst }) => (
          <div key={name} className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{icon}</span>
              <span className="text-[13px] font-semibold">{name}</span>
            </div>
            <p className="text-[12px] text-muted-foreground mb-3 leading-relaxed">{desc}</p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-primary font-medium">Best for: </span>
                <span className="text-muted-foreground">{best}</span>
              </div>
              <div>
                <span className="text-orange-500 font-medium">Avoid when: </span>
                <span className="text-muted-foreground">{worst}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">See it in action: the simulator</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The simulator below models a round-robin load balancer with equal capacity servers. Drag the
        traffic slider to push the system toward overload, then add servers to restore health. Notice
        how response time degrades non-linearly as utilization approaches 100%.
      </p>

      <ScalabilitySimulator />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-6">
        <p className="text-[13px] text-foreground/70">
          The queueing model above (M/M/1) is a simplification, but the intuition is correct. Real
          systems degrade faster due to garbage collection pauses, memory pressure, and lock contention.
          Keep production utilization below 60–70% to maintain headroom for traffic spikes.
        </p>
      </div>
    </section>
  );
}
