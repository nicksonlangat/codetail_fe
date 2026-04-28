import { DNSLookupChain } from "@/components/blog/interactive/dns-lookup-chain";

export function DNSSection() {
  return (
    <section>
      <h2 id="dns-resolution" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Step 1: DNS Resolution
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The internet routes traffic using IP addresses (like <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">142.250.80.46</code>),
        not human-readable hostnames. DNS — the Domain Name System — is the phone book that translates
        one to the other. It's hierarchical, distributed, and heavily cached.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">The caching hierarchy</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Before a DNS query ever hits the network, multiple caches are consulted. Each layer has its
        own TTL (Time To Live) — an expiry duration after which the cached answer is discarded and
        the lookup must be repeated. Step through a cold DNS lookup below:
      </p>

      <DNSLookupChain />

      <h3 className="text-base font-semibold mt-8 mb-3">TTL: the knob that controls freshness vs speed</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        TTL is set by whoever controls the domain. A short TTL (60 seconds) means changes propagate
        quickly — useful during a migration — but also means more DNS queries and higher latency for
        cold users. A long TTL (86400 seconds = 1 day) means faster repeat lookups but slow rollback
        if you need to change the IP.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">TTL</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Use case</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Trade-off</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {[
              { ttl: "30–60s", use: "Active failover, migration window", tradeoff: "More DNS queries, higher cold latency" },
              { ttl: "300s (5m)", use: "Most web services (sensible default)", tradeoff: "5-minute propagation window" },
              { ttl: "3600s (1h)", use: "Stable infrastructure, rarely changing", tradeoff: "Slow to update; good for performance" },
              { ttl: "86400s (1d)", use: "Static assets, CDN origins", tradeoff: "Very slow propagation, maximum caching" },
            ].map((row) => (
              <tr key={row.ttl}>
                <td className="py-2 pr-4 font-mono text-primary">{row.ttl}</td>
                <td className="py-2 pr-4 text-foreground/80">{row.use}</td>
                <td className="py-2 text-muted-foreground">{row.tradeoff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">DNS as a routing tool</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        DNS isn't just a lookup service — it's a traffic distribution tool. Large services
        use <strong>GeoDNS</strong> to return different IP addresses based on where the query comes from,
        routing users to the nearest data center. Combined with <strong>Anycast</strong> (one IP, many
        physical locations), DNS becomes the first layer of global load balancing.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { icon: "🌍", label: "GeoDNS", desc: "Returns different IPs per region. EU users → Frankfurt. US users → Virginia. Reduces latency by 100ms+ for global services." },
          { icon: "📡", label: "Anycast", desc: "One IP address routed to the closest server via BGP. CDN providers use this for sub-10ms DNS resolution worldwide." },
          { icon: "⚖️", label: "DNS Load Balancing", desc: "Return multiple A records. The client picks one (usually the first). Rotation adds a layer of distribution before any LB." },
          { icon: "🛡️", label: "DNS Failover", desc: "Health checks trigger automatic DNS changes when servers go down. Recovery time = TTL. Set short TTLs before planned maintenance." },
        ].map(({ icon, label, desc }) => (
          <div key={label} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
            <span className="text-lg flex-shrink-0">{icon}</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{label}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          <strong>Gotcha:</strong> "DNS propagation" is a myth for most changes. The delay you experience
          is just your old TTL expiring. Once the TTL is up, resolvers fetch fresh data immediately.
          Lowering your TTL <em>before</em> a migration to 60s means changes propagate in 60 seconds,
          not 48 hours.
        </p>
      </div>
    </section>
  );
}
