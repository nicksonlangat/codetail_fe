const INTERVIEW_STEPS = [
  {
    step: "1. Clarify requirements (5 min)",
    detail: "Ask: functional requirements, scale (DAU, RPS), consistency model, latency budget, any non-negotiables. Do not start designing until you know what you are building.",
  },
  {
    step: "2. Estimate capacity (5 min)",
    detail: "Work through read RPS, write RPS, storage per year, cache memory. Round aggressively. The goal is to identify the bottleneck before designing, not to be precise.",
  },
  {
    step: "3. High-level design (10 min)",
    detail: "Name the components (client, CDN, app server, cache, database, queue). Sketch the data flow. Define the most important API contracts. Identify the hot path.",
  },
  {
    step: "4. Deep dive (15 min)",
    detail: "Pick the hardest problem and go deep. For a URL shortener: code generation, cache invalidation, or analytics pipeline. Show you understand the tradeoffs.",
  },
  {
    step: "5. Operational concerns (5 min)",
    detail: "How do you monitor this? What fails first under overload? What did you leave out and why? This shows engineering maturity.",
  },
];

const LEFT_OUT = [
  { item: "Geographic distribution", why: "A multi-region deployment with latency-based routing could reduce redirect latency to under 20ms globally. Left out because it adds significant operational complexity and is only justified above ~500M daily redirects." },
  { item: "Custom domains", why: "Allowing users to use their own domain (e.g. links.mycompany.com) requires per-tenant TLS certificate provisioning and wildcard DNS. Left out as a V2 feature." },
  { item: "Abuse prevention", why: "Malicious actors use URL shorteners to obscure phishing links. Production systems integrate with Safe Browsing APIs and maintain a blocklist of flagged long URLs." },
  { item: "Link previews", why: "Open Graph metadata, QR code generation, and preview images require additional storage and a headless browser service. Valuable but out of scope for the core design." },
];

export function ProductionSection() {
  return (
    <section>
      <h2 id="production" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Production: Analytics, Resilience, and What We Left Out
      </h2>

      <h3 className="text-base font-semibold mt-6 mb-3">Analytics pipeline</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Analytics must never block the redirect path. The solution is to decouple them
        completely: the redirect handler emits a lightweight event to a message queue
        and returns the redirect immediately. A separate consumer reads from the queue
        in batches and writes to an analytical database.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Analytics pipeline: Kafka producer in the redirect handler
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# Click event schema (Kafka message value)
@dataclass
class ClickEvent:
    short_code: str
    timestamp: datetime
    referrer: str | None
    user_agent: str
    ip_hash: str      # hashed, not raw IP (privacy)
    country: str      # resolved from IP at edge

async def emit_click_event(short_code: str, request: Request):
    event = ClickEvent(
        short_code=short_code,
        timestamp=datetime.now(UTC),
        referrer=request.headers.get("Referer"),
        user_agent=request.headers.get("User-Agent", ""),
        ip_hash=hash_ip(request.client.host),
        country=request.headers.get("CF-IPCountry", "XX"),  # CDN-injected
    )
    try:
        # Fire and forget — if Kafka is down, drop the event
        # Analytics loss is acceptable; redirect failure is not
        await kafka_producer.send("click_events", value=asdict(event))
    except Exception:
        pass  # never propagate analytics failures to the caller

# ClickHouse consumer (separate service):
# Reads batches from Kafka, inserts into click_events table
# Materialised view aggregates: clicks_by_day, clicks_by_country`}
        </pre>
      </div>

      <div className="space-y-2 mb-8">
        {[
          {
            label: "Why Kafka, not a direct DB write?",
            detail: "Writing to ClickHouse (or any database) on every redirect is a synchronous operation that adds latency. Kafka absorbs the burst, batches the writes, and decouples the redirect path from analytics availability.",
          },
          {
            label: "Why ClickHouse, not Postgres?",
            detail: "ClickHouse is a columnar analytical database optimized for aggregation queries over billions of rows. Queries like clicks by country over 30 days complete in milliseconds. The same query on Postgres would take minutes at this volume.",
          },
        ].map(({ label, detail }) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">?</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{label}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Resilience</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The redirect path has two dependencies: Redis and PostgreSQL. Both can fail.
        The resilience strategy is to wrap Redis in a circuit breaker with a database
        fallback, so a Redis outage degrades performance (higher DB load) without
        causing user-visible failures.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-8 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Circuit breaker on Redis with DB fallback
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`from circuitbreaker import circuit, CircuitBreakerOpen

@circuit(failure_threshold=5, recovery_timeout=30)
async def cache_get(key: str) -> str | None:
    return await redis.get(key)

async def resolve_url(short_code: str) -> str:
    long_url = None

    try:
        long_url = await cache_get(f"url:{short_code}")
    except CircuitBreakerOpen:
        # Redis is known-failing — go straight to DB
        # Alert fires: this is a degraded but operational state
        pass
    except Exception:
        # Transient Redis error — circuit will count this failure
        pass

    if long_url is None:
        row = await db.fetchrow(
            "SELECT long_url FROM urls WHERE short_code = $1 AND "
            "(expires_at IS NULL OR expires_at > NOW())",
            short_code,
        )
        if row is None:
            raise HTTPException(status_code=404)
        long_url = row["long_url"]

        # Attempt to repopulate cache, but do not fail if Redis is down
        try:
            await redis.setex(f"url:{short_code}", 3600, long_url)
        except Exception:
            pass

    return long_url`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The interview framework</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The system design interview is a 45-minute structured conversation, not a
        free-form whiteboard session. The framework below allocates time to avoid
        spending 30 minutes on requirements and running out of time before the interesting design problems.
      </p>

      <div className="space-y-2 mb-8">
        {INTERVIEW_STEPS.map(({ step, detail }) => (
          <div key={step} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{step}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">What we left out</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A production URL shortener has dozens of additional concerns. Naming them
        explicitly in an interview demonstrates that you understand the full scope
        even when you choose to scope the design.
      </p>

      <div className="space-y-2">
        {LEFT_OUT.map(({ item, why }) => (
          <div key={item} className="flex gap-3 p-3 rounded-xl border border-border/50 bg-muted/30">
            <span className="text-muted-foreground font-bold text-sm flex-shrink-0 mt-0.5">–</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5 text-foreground/70">{item}</p>
              <p className="text-[11px] text-muted-foreground">{why}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
