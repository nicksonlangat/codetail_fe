export function WhatIsSection() {
  return (
    <section>
      <h2 id="what-is-a-load-balancer" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        What is a load balancer?
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A load balancer is a reverse proxy that sits in front of a group of servers and
        distributes incoming requests across them. Clients connect to the load balancer.
        The load balancer forwards each request to a backend server, waits for the response,
        and returns it to the client. The client never connects directly to a backend server.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          A load balancer is like a maitre d&apos; at a restaurant. You do not seat yourself.
          The maitre d&apos; knows which tables are occupied, which waiter has capacity, and
          routes you to the best available option. Servers are the tables. Requests are diners.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Load balancers serve three core functions. First: distribution, spreading traffic so no
        single server is overwhelmed. Second: redundancy, detecting when a server is unhealthy
        and routing around it. Third: abstraction, hiding the complexity of the backend fleet
        behind a single IP address.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Layer 4 vs Layer 7</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Load balancers operate at different layers of the networking stack.
        The layer they work at determines what information they can see and what decisions they can make.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        <div className="p-4 rounded-xl border border-brand-border bg-white space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-brand-surface px-2 py-0.5 rounded text-brand-text-muted">L4</span>
            <span className="text-[13px] font-semibold text-brand-text">Transport Layer</span>
          </div>
          <p className="text-[12px] text-brand-text-muted leading-relaxed">
            Sees only TCP/UDP metadata: source IP, destination IP, source port, destination port.
            Cannot read the HTTP request. Routes based on network-layer information alone.
          </p>
          <div className="space-y-1 text-[11px]">
            {[
              { icon: "✓", label: "Faster (no packet inspection)", color: "text-brand-primary" },
              { icon: "✓", label: "Protocol-agnostic (TCP, UDP, TLS)", color: "text-brand-primary" },
              { icon: "✗", label: "Cannot route by URL path or header", color: "text-brand-text-muted" },
              { icon: "✗", label: "Cannot do content-based routing", color: "text-brand-text-muted" },
            ].map(({ icon, label, color }) => (
              <div key={label} className="flex items-start gap-1.5">
                <span className={`font-mono text-[10px] mt-0.5 ${color}`}>{icon}</span>
                <span className="text-brand-text-muted">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-brand-text-muted">Examples: AWS NLB, HAProxy (TCP mode), hardware LBs</p>
        </div>

        <div className="p-4 rounded-xl border border-brand-primary/30 bg-brand-primary/5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-brand-primary/10 px-2 py-0.5 rounded text-brand-primary">L7</span>
            <span className="text-[13px] font-semibold text-brand-text">Application Layer</span>
          </div>
          <p className="text-[12px] text-brand-text-muted leading-relaxed">
            Fully decodes the HTTP request. Sees method, URL path, headers, cookies, and body.
            Can make intelligent routing decisions based on request content.
          </p>
          <div className="space-y-1 text-[11px]">
            {[
              { icon: "✓", label: "Route /api to API servers, / to frontend", color: "text-brand-primary" },
              { icon: "✓", label: "Sticky sessions via cookies", color: "text-brand-primary" },
              { icon: "✓", label: "SSL/TLS termination at the edge", color: "text-brand-primary" },
              { icon: "✓", label: "Request rewriting, header injection", color: "text-brand-primary" },
            ].map(({ icon, label, color }) => (
              <div key={label} className="flex items-start gap-1.5">
                <span className={`font-mono text-[10px] mt-0.5 ${color}`}>{icon}</span>
                <span className="text-brand-text-muted">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-brand-text-muted">Examples: AWS ALB, Nginx, Caddy, Traefik, Cloudflare LB</p>
        </div>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">When do you need one?</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="text-left py-2 pr-4 text-brand-text-muted font-medium">Situation</th>
              <th className="text-left py-2 text-brand-text-muted font-medium">Why a load balancer helps</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {[
              { sit: "Single server at capacity", why: "Add more servers and distribute traffic across them. Capacity scales linearly." },
              { sit: "Single point of failure", why: "Health checks detect failures; traffic reroutes to healthy servers in seconds, not hours." },
              { sit: "Zero-downtime deployments", why: "Rolling deploys: drain one server, update it, return to rotation. Users never see downtime." },
              { sit: "Multiple services (API + frontend)", why: "Route by path: /api to API fleet, everything else to frontend fleet. One public IP." },
              { sit: "Geographic distribution", why: "Multiple LBs in regions, GeoDNS routes users to nearest. Latency drops for global users." },
            ].map(({ sit, why }) => (
              <tr key={sit}>
                <td className="py-2 pr-4 font-medium text-brand-text/80 align-top text-[11px]">{sit}</td>
                <td className="py-2 text-brand-text-muted">{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
