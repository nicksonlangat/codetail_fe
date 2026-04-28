const THREAT_SCENARIOS = [
  {
    threat: "Credential stuffing",
    without: "An attacker tries 100,000 password combinations against /auth/login. Each attempt is a valid HTTP request. Success rate: 0.1% = 100 accounts compromised.",
    with: "5 login attempts per IP per minute. After 5 failures: 429. Attack requires 20,000 IPs to maintain speed, making it economically unviable.",
    severity: "high",
  },
  {
    threat: "Accidental DDoS (runaway client)",
    without: "A bug in a client retries a failing endpoint in a tight loop. 50 clients × 1000 req/sec = 50,000 req/sec hitting your API. Database falls over.",
    with: "100 requests per minute per API key. Runaway client gets 429 after 100 requests. Database load stays bounded.",
    severity: "high",
  },
  {
    threat: "Web scraping",
    without: "A competitor scrapes your product catalog at 500 req/sec, exporting your pricing data to a spreadsheet. Your CDN bill quadruples.",
    with: "10 requests per second per IP on catalog endpoints. Scraper throttled to 1/50th of original speed, making bulk extraction impractical.",
    severity: "medium",
  },
  {
    threat: "Expensive endpoint abuse",
    without: "Your /reports/generate endpoint triggers a 30-second database query. A single user hammers it 10 times concurrently. Database CPU at 100%, all other queries slow.",
    with: "2 concurrent requests per user on /reports. Excess requests queued or rejected immediately. Other users unaffected.",
    severity: "high",
  },
];

export function WhyRateLimitSection() {
  return (
    <section>
      <h2 id="why-rate-limit" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Why Rate Limiting Exists
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A public API endpoint without rate limiting is a shared resource with no admission
        control. A single misbehaving client — whether a bug, a bot, or an attacker — can
        consume the capacity that was provisioned for thousands of users. Rate limiting is
        the mechanism by which a system enforces fairness: each client gets a bounded share
        of capacity, regardless of how aggressively they request.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The goals are distinct but often conflated. Availability protection keeps a single
        client from taking down the service for everyone else. Security prevents brute force
        and credential stuffing. Cost control bounds the bill when a compute-heavy endpoint
        is called at scale. Fairness ensures that a paying customer's experience is not
        degraded by a free-tier user consuming resources without bound.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">What happens without rate limiting</h3>

      <div className="space-y-3 mb-8">
        {THREAT_SCENARIOS.map(({ threat, without, with: w, severity }) => (
          <div key={threat} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${severity === "high" ? "bg-destructive" : "bg-orange-400"}`} />
              <span className="text-[11px] font-semibold">{threat}</span>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
              <div className="px-4 py-3">
                <p className="text-[9px] uppercase tracking-wider text-destructive mb-1">Without rate limiting</p>
                <p className="text-[11px] text-muted-foreground">{without}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[9px] uppercase tracking-wider text-primary mb-1">With rate limiting</p>
                <p className="text-[11px] text-muted-foreground">{w}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Dimensions of rate limiting</h3>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          {
            dimension: "By identity",
            desc: "Limit per API key, per user ID, per session token. Authenticated clients get individual quotas. One bad client cannot affect others.",
          },
          {
            dimension: "By IP address",
            desc: "Limit per source IP. Effective against unauthenticated endpoints (login, registration). Problematic for shared NATs (corporate offices, mobile carriers).",
          },
          {
            dimension: "By endpoint",
            desc: "Different limits for different routes. /reports (expensive) gets 2/min. /ping (cheap) gets 1000/min. Match the limit to the cost of the operation.",
          },
          {
            dimension: "By tier",
            desc: "Free tier: 100 requests/day. Pro tier: 10,000/day. Enterprise: unlimited. Rate limits become a product feature and a monetization lever.",
          },
          {
            dimension: "By resource",
            desc: "Limit by tokens spent, not requests counted. An AI API charges 1 token for a short completion and 1000 for a long one. Token buckets match resource consumption.",
          },
          {
            dimension: "By time granularity",
            desc: "Per-second limits prevent bursts. Per-day limits allow flexible usage patterns. Layering both (10/sec AND 10,000/day) provides burst protection and quota enforcement.",
          },
        ].map(({ dimension, desc }) => (
          <div key={dimension} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{dimension}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
