const TIMEOUT_TYPES = [
  {
    type: "Connection timeout",
    value: "1-3 seconds",
    desc: "How long to wait for the TCP connection to be established. If the server is unreachable or the load balancer is saturated, this fires first.",
    when: "Always set. A missing connection timeout means waiting indefinitely for a dead server.",
  },
  {
    type: "Read timeout",
    value: "500ms - 5 seconds",
    desc: "How long to wait after the connection is established for the server to send a response byte. Triggers when the server is connected but hanging on a slow query or lock.",
    when: "Set based on the p99 latency of the downstream endpoint. Not a global default — tune per endpoint.",
  },
  {
    type: "Total request timeout",
    value: "p99 + buffer",
    desc: "Hard cap on the entire request lifecycle including retries. Prevents a retry loop from occupying a thread longer than the caller's SLA allows.",
    when: "Set to (retry_count * (read_timeout + jitter)) + buffer. Never let retries outlive the caller's patience.",
  },
  {
    type: "Idle connection timeout",
    value: "30-90 seconds",
    desc: "How long to keep an idle connection in the pool before closing it. Must be shorter than any upstream load balancer or NAT gateway idle timeout to avoid surprise RST packets.",
    when: "Connection pool maintenance. Default in most HTTP clients. Check against your infrastructure's idle timeout.",
  },
];

const RETRY_PATTERNS = [
  {
    name: "Exponential backoff",
    formula: "wait = base * 2^attempt",
    example: "1s, 2s, 4s, 8s, 16s",
    desc: "Each retry waits twice as long as the previous. Reduces retry storm as all clients slow down together. Without jitter, clients that started together retry together.",
  },
  {
    name: "Exponential backoff with jitter",
    formula: "wait = random(0, base * 2^attempt)",
    example: "0.3s, 1.7s, 3.1s, 9.4s",
    desc: "Randomizes the wait time. Clients that started together now retry at different times, spreading load on the recovering service. Full jitter (0 to max) is most effective.",
  },
  {
    name: "Decorrelated jitter",
    formula: "wait = random(base, prev_wait * 3)",
    example: "1s, 2.3s, 5.8s, 14.2s",
    desc: "AWS's recommended approach. Each retry is a random value between the base delay and 3x the previous delay. Produces better spread than exponential + full jitter.",
  },
];

export function RetryAndTimeoutSection() {
  return (
    <section>
      <h2 id="retry-timeout" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Retries and Timeouts
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Timeouts and retries are the first line of resilience: every outbound call must
        have a timeout, and transient failures should be retried with backoff. Without
        timeouts, a slow dependency occupies a thread forever. Without retries, a single
        dropped packet causes a user-facing error. Without backoff, retries amplify load
        on an already struggling service.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Timeout types</h3>

      <div className="space-y-2 mb-8">
        {TIMEOUT_TYPES.map(({ type, value, desc, when }) => (
          <div key={type} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{type}</span>
              <span className="ml-auto font-mono text-[10px] text-primary">{value}</span>
            </div>
            <div className="px-4 py-3 space-y-1 text-[11px]">
              <p className="text-muted-foreground">{desc}</p>
              <p><span className="font-medium text-foreground/80">When: </span><span className="text-muted-foreground">{when}</span></p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Retry strategies</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Only retry idempotent operations. A GET request can always be retried. A POST
        that creates a record must not be retried without an idempotency key — you risk
        creating the record twice. An idempotency key (a UUID in a request header) lets
        the server detect and discard duplicate requests, making any operation safe to
        retry.
      </p>

      <div className="space-y-3 mb-6">
        {RETRY_PATTERNS.map(({ name, formula, example, desc }) => (
          <div key={name} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{name}</span>
              <span className="font-mono text-[9px] text-muted-foreground">{formula}</span>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              <div className="flex gap-1.5 font-mono text-[9px]">
                {example.split(", ").map((v, i) => (
                  <span key={i} className="px-2 py-1 bg-muted rounded text-muted-foreground">{v}</span>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Retry with exponential backoff + jitter + idempotency key
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`import asyncio, random, uuid, httpx

async def call_with_retry(
    url: str,
    payload: dict,
    max_attempts: int = 3,
    base_delay: float = 0.5,
) -> dict:
    idempotency_key = str(uuid.uuid4())

    for attempt in range(max_attempts):
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.post(
                    url,
                    json=payload,
                    headers={"Idempotency-Key": idempotency_key},
                )
                resp.raise_for_status()
                return resp.json()

        except (httpx.TimeoutException, httpx.HTTPStatusError) as e:
            if attempt == max_attempts - 1:
                raise
            # Exponential backoff with full jitter
            max_wait = base_delay * (2 ** attempt)
            wait = random.uniform(0, max_wait)
            await asyncio.sleep(wait)

    raise RuntimeError("unreachable")`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">What NOT to retry</h3>

      <div className="space-y-2">
        {[
          { case: "4xx responses (except 429)", detail: "400 Bad Request, 401, 403, 404 indicate a client error that will not resolve on retry. Retrying wastes resources and delays the error surfacing to the caller." },
          { case: "Non-idempotent operations without idempotency keys", detail: "POST /orders without an idempotency key will create duplicate orders on retry. Add Idempotency-Key header and handle deduplication on the server." },
          { case: "When the circuit is open", detail: "Do not retry into an open circuit. The circuit is open because the service is failing. Retrying bypasses the protection and defeats the purpose." },
          { case: "When the total timeout budget is exhausted", detail: "If the caller has a 2-second SLA and two retries already took 1.8 seconds, the third retry is not useful — it will time out from the caller's perspective regardless." },
        ].map(({ case: c, detail }) => (
          <div key={c} className="flex gap-3 p-3 rounded-xl border border-orange-400/20 bg-orange-400/5">
            <span className="text-orange-500 font-bold text-sm flex-shrink-0 mt-0.5">!</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{c}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
