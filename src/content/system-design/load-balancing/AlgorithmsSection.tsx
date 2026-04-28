import { LoadBalancerExplorer } from "@/components/blog/interactive/load-balancer-explorer";

export function AlgorithmsSection() {
  return (
    <section>
      <h2 id="algorithms" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Distribution Algorithms
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The algorithm determines which backend server receives each incoming request.
        The right choice depends on whether servers are homogeneous, whether requests
        have uniform cost, and whether users need to be pinned to a specific server.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Use the explorer below to see each algorithm in action. Switch algorithms, kill a server,
        and watch how traffic redistributes. The distribution chart at the bottom shows
        where requests are actually landing.
      </p>

      <LoadBalancerExplorer />

      <div className="space-y-4 mt-8">
        {[
          {
            name: "Round Robin",
            code: "server = servers[request_count % len(servers)]",
            pros: ["Zero configuration. Works out of the box for homogeneous fleets.", "Predictable distribution: N servers each get exactly 1/N of traffic over time."],
            cons: ["Ignores server load. A server handling a 5-second request gets the same traffic as one doing 1ms work.", "Breaks if servers have different hardware specs."],
            best: "Identical servers, uniform request cost (most REST APIs, static file serving).",
          },
          {
            name: "Least Connections",
            code: "server = min(servers, key=lambda s: s.active_connections)",
            pros: ["Self-balancing: faster servers naturally drain their queue and accept more requests.", "Handles variable request duration correctly without any configuration."],
            cons: ["Requires the LB to track active connection counts for every backend.", "Overhead of counting connections can outweigh benefit for very short-lived requests."],
            best: "Variable request duration (database queries, external API calls, streaming).",
          },
          {
            name: "IP Hash",
            code: "server = servers[hash(client_ip) % len(servers)]",
            pros: ["Session affinity without application changes or cookie overhead.", "Deterministic: same client always hits same server, useful for in-memory caches."],
            cons: ["Uneven distribution if traffic comes from a small number of IPs (e.g., corporate NAT).", "Adding or removing servers remaps all clients. Consistent hashing solves this."],
            best: "Stateful applications needing affinity, when adding sticky session cookies is not possible.",
          },
          {
            name: "Weighted Round Robin",
            code: "# Server A: weight 3, Server B: weight 1 => A gets 75%, B gets 25%",
            pros: ["Handles heterogeneous fleets with different CPU/RAM correctly.", "Simple extension of round robin with a single weight parameter per server."],
            cons: ["Weights must be configured manually and updated when hardware changes.", "Dynamic load changes are not reflected in static weights."],
            best: "Mixed hardware fleets, gradual traffic migration (canary deploys use this: 5% weight to new version).",
          },
        ].map(({ name, code, pros, cons, best }) => (
          <div key={name} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 bg-secondary/50 border-b border-border">
              <span className="text-[13px] font-semibold">{name}</span>
            </div>
            <div className="p-4 space-y-3">
              <pre className="text-[10px] font-mono bg-muted rounded-lg px-3 py-2.5 overflow-x-auto">{code}</pre>
              <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-primary mb-1.5">Strengths</p>
                  <ul className="space-y-1">
                    {pros.map((p) => (
                      <li key={p} className="flex gap-1.5 text-muted-foreground">
                        <span className="text-primary flex-shrink-0">+</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-orange-500 mb-1.5">Weaknesses</p>
                  <ul className="space-y-1">
                    {cons.map((c) => (
                      <li key={c} className="flex gap-1.5 text-muted-foreground">
                        <span className="text-orange-500 flex-shrink-0">-</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground border-t border-border pt-2">
                <span className="font-medium text-foreground">Best for: </span>{best}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
