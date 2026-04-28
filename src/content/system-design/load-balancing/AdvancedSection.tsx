export function AdvancedSection() {
  return (
    <section>
      <h2 id="advanced-features" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        SSL Termination, Sticky Sessions, and Global Load Balancing
      </h2>

      <h3 className="text-base font-semibold mt-2 mb-3">SSL/TLS termination</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Decrypting HTTPS is CPU-intensive. Rather than making every application server handle TLS,
        the load balancer can terminate TLS at the edge and forward plain HTTP internally.
        This is called SSL termination.
      </p>

      <div className="bg-card border border-border rounded-xl p-5 mb-6 not-prose">
        <div className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 mb-4">
          SSL termination flow
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-1 text-[11px]">
          {[
            { label: "Client", sub: "HTTPS", icon: "🌐" },
            { arrow: "HTTPS 🔒" },
            { label: "Load Balancer", sub: "Terminates TLS", icon: "⚖️", highlight: true },
            { arrow: "HTTP 🔓" },
            { label: "App Servers", sub: "Plain HTTP inside VPC", icon: "🖥️" },
          ].map((item, i) =>
            "arrow" in item ? (
              <div key={i} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span>{item.arrow}</span>
                <span>→</span>
              </div>
            ) : (
              <div key={i} className={`flex flex-col items-center p-3 rounded-xl border text-center ${
                "highlight" in item && item.highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card"
              }`}>
                <span className="text-lg mb-1">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
                <span className="text-[9px] text-muted-foreground">{item.sub}</span>
              </div>
            )
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {[
          { label: "Certificate management in one place", desc: "Renew TLS certificates on the LB only. No need to update certs on every backend server." },
          { label: "Faster backends", desc: "App servers do zero TLS work. CPU is fully available for application logic." },
          { label: "Traffic inspection at L7", desc: "Decrypted traffic lets the LB read headers, inject request IDs, and do content-based routing." },
          { label: "Re-encryption for compliance", desc: "Some environments require encrypted traffic end-to-end. LB terminates and re-encrypts before forwarding." },
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

      <h3 className="text-base font-semibold mt-8 mb-3">Sticky sessions (session affinity)</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        By default, each request may land on any server. For stateful applications that store
        session data in memory, this causes users to lose their session when routed to a different
        server. Sticky sessions solve this by binding a user to a specific backend.
      </p>

      <div className="space-y-2 mb-6">
        {[
          {
            method: "Cookie-based",
            how: "LB sets a cookie (e.g., AWSALB=...) on the first response. Subsequent requests from that client include the cookie; LB reads it and routes to the same server.",
            note: "The safest approach. Works with L7 LBs. Cookie has a configurable TTL.",
          },
          {
            method: "IP-hash based",
            how: "Hash the client IP to consistently map to a server. No cookie needed. Works at L4.",
            note: "Breaks under NAT (many users share one IP). Distribution can be uneven.",
          },
        ].map(({ method, how, note }) => (
          <div key={method} className="p-4 rounded-xl border border-border bg-card text-[12px]">
            <p className="font-semibold mb-1">{method}</p>
            <p className="text-muted-foreground mb-2 leading-relaxed">{how}</p>
            <p className="text-[11px] text-muted-foreground/70 italic">{note}</p>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mb-8">
        <p className="text-[13px] text-foreground/70">
          <strong>Avoid sticky sessions if you can.</strong> They make deployments harder (you must
          drain stickied servers before removing them), break auto-scaling (new servers receive no
          traffic from existing sessions), and are a crutch for a stateful architecture.
          Move session state to Redis instead, and become truly stateless.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Global load balancing</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Regional load balancers work within a single data center. For global services, you
        need to route users to the nearest data center as well. Two techniques handle this.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        <div className="p-4 bg-card border border-border rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🌍</span>
            <span className="text-[13px] font-semibold">GeoDNS</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            DNS returns different IP addresses based on the geographic location of the DNS query.
            EU users get a Frankfurt IP, US users get a Virginia IP.
            Each resolves to a regional load balancer.
          </p>
          <div className="text-[10px] space-y-1 text-muted-foreground">
            <p><span className="text-foreground font-medium">Latency reduction:</span> 50-200ms for global users</p>
            <p><span className="text-foreground font-medium">Propagation delay:</span> Bound by DNS TTL</p>
            <p><span className="text-foreground font-medium">Used by:</span> Cloudflare, AWS Route 53, Google Cloud DNS</p>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-base">📡</span>
            <span className="text-[13px] font-semibold">Anycast</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            A single IP address is announced from multiple physical locations via BGP routing.
            The internet automatically routes traffic to the nearest announcement point.
            No DNS tricks required.
          </p>
          <div className="text-[10px] space-y-1 text-muted-foreground">
            <p><span className="text-foreground font-medium">Failover speed:</span> Sub-second (BGP convergence)</p>
            <p><span className="text-foreground font-medium">DDoS resistance:</span> Attack traffic absorbed across PoPs</p>
            <p><span className="text-foreground font-medium">Used by:</span> Cloudflare, Fastly, all major CDNs</p>
          </div>
        </div>
      </div>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          CDNs combine Anycast with load balancing: each PoP is a cluster of servers behind
          a load balancer, and the PoP itself is reached via Anycast. Users get sub-10ms
          latency to the edge, with the LB distributing load across servers within that PoP.
        </p>
      </div>
    </section>
  );
}
