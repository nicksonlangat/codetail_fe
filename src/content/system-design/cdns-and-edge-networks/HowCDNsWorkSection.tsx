import { CDNFlowVisualizer } from "@/components/blog/interactive/cdn-flow-visualizer";

const POP_TABLE = [
  { provider: "Cloudflare", pops: "300+", locations: "100+ countries", note: "Anycast network — single IP, nearest PoP serves the request automatically" },
  { provider: "AWS CloudFront", pops: "600+", locations: "90+ cities", note: "Deep integration with S3, ALB, Lambda@Edge. Regional edge caches as mid-tier" },
  { provider: "Fastly", pops: "70+", locations: "Global", note: "Instant purge (<150ms global propagation), programmable VCL, popular with streaming" },
  { provider: "Akamai", pops: "4,000+", locations: "Global", note: "Largest network. Enterprise focus. Fine-grained control over routing and security" },
];

export function HowCDNsWorkSection() {
  return (
    <section>
      <h2 id="how-cdns-work" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        How CDNs Work
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A Content Delivery Network is a geographically distributed network of cache servers
        (called Points of Presence, or PoPs) positioned close to end users. When a user
        requests a resource, the CDN routes the request to the nearest PoP rather than the
        origin server. If the PoP has a cached copy (a cache hit), it responds immediately.
        If not (a cache miss), it fetches from the origin, caches the response, and serves it.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The latency reduction is significant. An API origin in us-east-1 has a round-trip
        time of ~200ms to a user in Sydney. A CDN edge node in Singapore reduces that to
        ~15ms. For static assets — images, JavaScript bundles, CSS, fonts — the entire
        request is served from the edge and the origin is never touched. For dynamic content,
        CDNs can still help by terminating TLS at the edge (saving one full round trip for
        the TLS handshake) and compressing the response.
      </p>

      <CDNFlowVisualizer />

      <h3 className="text-base font-semibold mt-4 mb-3">Anycast routing</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Most CDNs use anycast IP routing: many edge servers share the same IP address,
        and the internet's routing protocol (BGP) directs each client to the topologically
        nearest one automatically. No DNS lookup is needed to find the nearest edge. The
        routing is transparent to the client — it sends a request to the CDN's IP and
        receives a response from whatever PoP is closest.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Unicast CDNs (like AWS CloudFront) use DNS-based routing instead: a DNS query
        for assets.example.com returns the IP of the nearest edge location. This requires
        a DNS lookup on each new connection but achieves similar geographic routing.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Pull vs push CDN</h3>

      <div className="grid sm:grid-cols-2 gap-3 mb-8 not-prose">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[11px] font-semibold mb-2">Pull CDN (most common)</p>
          <p className="text-[11px] text-muted-foreground mb-3">
            The CDN fetches from origin on the first cache miss and caches the response.
            No upload step needed. Assets are cached on demand, at the PoPs that actually
            serve them.
          </p>
          <div className="space-y-1 text-[10px]">
            {[
              "Zero setup for new assets",
              "Only caches what is actually requested",
              "First request per PoP is a cache miss",
              "Used by: Cloudflare, CloudFront, Fastly",
            ].map(p => (
              <p key={p} className="flex gap-1.5 text-muted-foreground">
                <span className="text-primary">→</span> {p}
              </p>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[11px] font-semibold mb-2">Push CDN</p>
          <p className="text-[11px] text-muted-foreground mb-3">
            You explicitly upload assets to the CDN at deploy time. All PoPs are pre-warmed.
            No cache misses after deploy. Typically used for large media files and software
            distribution.
          </p>
          <div className="space-y-1 text-[10px]">
            {[
              "Zero cache misses after push",
              "Requires explicit upload on every deploy",
              "Storage cost at every PoP",
              "Used by: Rackspace Cloud Files, Bunny CDN",
            ].map(p => (
              <p key={p} className="flex gap-1.5 text-muted-foreground">
                <span className="text-primary">→</span> {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Major providers</h3>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              {["Provider", "PoPs", "Coverage", "Notes"].map(h => (
                <th key={h} className="text-left py-2 pr-4 text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {POP_TABLE.map(({ provider, pops, locations, note }) => (
              <tr key={provider}>
                <td className="py-2.5 pr-4 font-semibold text-foreground/80 align-top">{provider}</td>
                <td className="py-2.5 pr-4 font-mono text-primary align-top">{pops}</td>
                <td className="py-2.5 pr-4 text-muted-foreground align-top">{locations}</td>
                <td className="py-2.5 text-muted-foreground align-top">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
