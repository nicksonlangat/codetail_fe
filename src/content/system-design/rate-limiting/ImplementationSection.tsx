const HEADER_CONVENTIONS = [
  { header: "X-RateLimit-Limit", value: "100", desc: "Maximum requests allowed in the current window" },
  { header: "X-RateLimit-Remaining", value: "43", desc: "Requests remaining in the current window" },
  { header: "X-RateLimit-Reset", value: "1735689600", desc: "Unix timestamp when the window resets" },
  { header: "Retry-After", value: "47", desc: "Seconds until the client can retry (on 429 responses)" },
  { header: "X-RateLimit-Policy", value: "100;w=60", desc: "Machine-readable policy (IETF draft standard)" },
];

const PLACEMENT_OPTIONS = [
  {
    location: "API Gateway / Reverse proxy",
    examples: "Nginx, Kong, Envoy, AWS API Gateway",
    pro: "Applied before request reaches application code. Protects all downstream services uniformly. No code change in application.",
    con: "Coarse-grained: all routes share the same limit unless gateway config supports per-route rules. Less context (no user tier).",
    when: "Global protection against unauthenticated abuse, IP-based limiting, and DDoS mitigation.",
  },
  {
    location: "Application middleware",
    examples: "FastAPI middleware, Django middleware, Express middleware",
    pro: "Full request context available: user ID, subscription tier, endpoint cost. Per-user and per-tier limits are straightforward.",
    con: "Applied after network I/O. Application still handles the incoming request (a cost). Must share rate limit state via Redis in multi-instance deployments.",
    when: "Authenticated API rate limiting, tier-based quotas, per-endpoint limits.",
  },
  {
    location: "CDN edge",
    examples: "Cloudflare Rate Limiting, Fastly, Akamai",
    pro: "Blocking happens at the network edge, before traffic reaches your infrastructure. Protects against volumetric attacks at global scale.",
    con: "Limited to IP or cookie-based identification. Cannot make application-level decisions (user tier, endpoint cost).",
    when: "DDoS mitigation, scraping protection, unauthenticated endpoints.",
  },
];

export function ImplementationSection() {
  return (
    <section>
      <h2 id="implementation" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Implementation: Distributed Rate Limiting
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A single-process rate limiter is trivial. The challenge in production is distributed
        rate limiting: multiple application instances must share the same counter so that a
        client cannot bypass the limit by routing requests across different servers. Redis is
        the standard solution — a single Redis cluster holds all rate limit state, and
        application instances check against it on every request.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The critical requirement is atomicity. An INCR followed by an expiry check is not
        atomic: two simultaneous requests can both read "0" and both allow themselves, counting
        one request but allowing two. Redis Lua scripts run atomically (the server executes
        the entire script before processing any other command), making them the correct
        implementation primitive for rate limiters.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Application middleware pattern (FastAPI)</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`import time
from fastapi import Request, HTTPException
from redis.asyncio import Redis

redis = Redis(host="localhost", decode_responses=True)

RATE_LIMITS = {
    "free":       (100,  60),   # 100 req / 60 sec
    "pro":        (1000, 60),
    "enterprise": (None, None), # unlimited
}

async def rate_limit_middleware(request: Request, call_next):
    user = request.state.user           # set by auth middleware
    tier = user.subscription_tier       # "free" | "pro" | "enterprise"
    limit, window = RATE_LIMITS[tier]

    if limit is None:                   # enterprise: skip check
        return await call_next(request)

    key = f"rl:{user.id}:{int(time.time()) // window}"
    count = await redis.incr(key)
    if count == 1:
        await redis.expire(key, window * 2)

    remaining = max(0, limit - count)
    reset_at = (int(time.time()) // window + 1) * window

    if count > limit:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded",
            headers={
                "X-RateLimit-Limit":     str(limit),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset":     str(reset_at),
                "Retry-After":           str(reset_at - int(time.time())),
            },
        )

    response = await call_next(request)
    response.headers["X-RateLimit-Limit"]     = str(limit)
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    response.headers["X-RateLimit-Reset"]     = str(reset_at)
    return response`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">429 response best practices</h3>

      <div className="space-y-2 mb-8">
        {[
          {
            rule: "Always include Retry-After",
            detail: "Clients that receive a 429 without Retry-After have no choice but to retry immediately, creating a storm. Retry-After tells the client exactly how long to wait. Most HTTP clients and SDK retry logic honors it.",
          },
          {
            rule: "Return a structured error body",
            detail: 'The 429 body should be machine-readable: { "error": "rate_limit_exceeded", "limit": 100, "reset_at": 1735689600 }. Clients can log it, surface it to users, or adjust retry strategy based on the reset time.',
          },
          {
            rule: "Never silently drop requests",
            detail: "A 429 is informative. Silently dropping the request (connection timeout, no response) is not. The client does not know whether to retry or whether the request was processed.",
          },
          {
            rule: "Return remaining quota on all 2xx responses",
            detail: "Include X-RateLimit-Remaining on every successful response, not just when the limit is near. Well-behaved clients use this to self-throttle before they hit the limit.",
          },
          {
            rule: "Use exponential backoff with jitter on the client",
            detail: "When a client hits a 429, retrying after exactly Retry-After seconds means all rate-limited clients retry simultaneously. Add jitter: wait Retry-After + random(0, 1) seconds to spread the retry load.",
          },
        ].map(({ rule, detail }) => (
          <div key={rule} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{rule}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Standard response headers</h3>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Header</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Example</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Meaning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {HEADER_CONVENTIONS.map(({ header, value, desc }) => (
              <tr key={header}>
                <td className="py-2 pr-4 font-mono text-[10px] text-primary align-top">{header}</td>
                <td className="py-2 pr-4 font-mono text-[10px] text-foreground/80 align-top">{value}</td>
                <td className="py-2 text-muted-foreground align-top">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Where to enforce rate limits</h3>

      <div className="space-y-3">
        {PLACEMENT_OPTIONS.map(({ location, examples, pro, con, when }) => (
          <div key={location} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[11px] font-semibold">{location}</p>
              <p className="text-[9px] text-muted-foreground font-mono">{examples}</p>
            </div>
            <div className="px-4 py-3 space-y-1 text-[11px]">
              <p><span className="font-medium text-primary">Pro: </span><span className="text-muted-foreground">{pro}</span></p>
              <p><span className="font-medium text-orange-500">Con: </span><span className="text-muted-foreground">{con}</span></p>
              <p><span className="font-medium text-foreground/80">Use when: </span><span className="text-muted-foreground">{when}</span></p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
