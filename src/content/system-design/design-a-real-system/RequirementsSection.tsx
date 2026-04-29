import { SystemDesignCalculator } from "@/components/blog/interactive/system-design-calculator";

const FUNCTIONAL = [
  {
    req: "Shorten a URL",
    detail: "Given any valid URL, generate a short alias (e.g. ct.ly/xK3pQ). The alias must be globally unique and URL-safe.",
  },
  {
    req: "Redirect",
    detail: "GET /:code returns a redirect to the original URL. This is the hot path: every user click hits this endpoint.",
  },
  {
    req: "Custom aliases",
    detail: "Users may request a specific short code. If available, use it. If taken, return 409 Conflict.",
  },
  {
    req: "Expiry",
    detail: "URLs expire after a configurable TTL (default: 5 years). Expired codes return 410 Gone, not 404.",
  },
  {
    req: "Click analytics",
    detail: "Record each redirect: timestamp, referrer, user agent, country. Accessible via dashboard. Best-effort, not transactional.",
  },
];

const NONFUNCTIONAL = [
  {
    req: "Redirect latency",
    target: "p99 < 100ms",
    note: "Cache hit under 5ms. Cache miss under 50ms. This is the user-visible operation.",
  },
  {
    req: "Availability",
    target: "99.9% uptime",
    note: "8.7 hours downtime per year. The redirect path must have no single point of failure.",
  },
  {
    req: "Durability",
    target: "Zero URL loss",
    note: "Once created, a URL must be retrievable until expiry. WAL and synchronous replication required.",
  },
  {
    req: "Write consistency",
    target: "Immediately readable",
    note: "A URL created via POST must be immediately redirectable via GET. No eventual consistency on writes.",
  },
  {
    req: "Analytics",
    target: "Eventually consistent",
    note: "Click counts may lag by seconds. The redirect path must not wait for analytics writes to complete.",
  },
  {
    req: "Scalability",
    target: "10x traffic headroom",
    note: "Design for 10x peak traffic without re-architecting. Scale out, not up.",
  },
];

export function RequirementsSection() {
  return (
    <section>
      <h2 id="requirements" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Requirements and Capacity Estimation
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Every system design begins with requirements. The goal is not to build the largest system
        possible, but the simplest system that satisfies the stated requirements. Capacity
        estimation calibrates the design: 1K RPS needs a different architecture than 1M RPS,
        and building for 1M when you have 1K is waste.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">The system: a URL shortener</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        We will design a URL shortener: a service that maps a long URL to a short alias
        and redirects clients that request that alias. This is the canonical system design
        interview problem because it touches almost every topic in this series: databases,
        caching, CDNs, rate limiting, message queues, and resilience patterns.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Functional requirements</h3>

      <div className="space-y-2 mb-8">
        {FUNCTIONAL.map(({ req, detail }) => (
          <div key={req} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{req}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Non-functional requirements</h3>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Requirement</th>
              <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Target</th>
              <th className="text-left py-2 font-medium text-muted-foreground">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {NONFUNCTIONAL.map(({ req, target, note }) => (
              <tr key={req}>
                <td className="py-2.5 pr-4 font-medium text-foreground/80 align-top">{req}</td>
                <td className="py-2.5 pr-4 font-mono text-[10px] text-primary align-top whitespace-nowrap">{target}</td>
                <td className="py-2.5 text-muted-foreground align-top">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Capacity estimation</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Adjust the sliders to match your expected traffic profile. The derived infrastructure
        requirements tell you what you need to build. The same design decisions apply at every
        scale; only the sizes change.
      </p>

      <SystemDesignCalculator />

      <div className="bg-muted/30 border border-border rounded-xl p-4 text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Worked example: 100M daily redirects</p>
        <p className="text-muted-foreground">
          100M/day = 1,157 avg RPS. Peak at 2.5x = 2,893 RPS. At 100:1 read/write ratio: 29 write RPS.
          With 90% cache hit rate: only 290 DB read IOPS. Hot set (top 20% of URLs): 1.6 GB Redis.
          Total 5-year storage: ~15 GB. This fits comfortably on 2 app servers with a single Postgres instance.
        </p>
        <p className="text-muted-foreground">
          Push to 1B daily redirects and the picture changes: 28,935 peak RPS, 15 app servers,
          Redis cluster, read replicas. Same design decisions, different sizing.
        </p>
      </div>
    </section>
  );
}
