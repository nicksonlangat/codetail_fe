const TOKEN_BUCKET_LUA = `-- token_bucket.lua
-- Atomically check and consume one token from a per-user bucket.
-- Returns 1 (allowed) or 0 (rate limited).
--
-- KEYS[1] = bucket key (e.g. "ratelimit:{user_id}")
-- ARGV[1] = bucket capacity (max tokens)
-- ARGV[2] = refill rate per second
-- ARGV[3] = current timestamp (seconds)

local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local bucket = redis.call("HMGET", key, "tokens", "last_refill")
local tokens = tonumber(bucket[1]) or capacity
local last_refill = tonumber(bucket[2]) or now

-- Refill tokens based on elapsed time
local elapsed = now - last_refill
local new_tokens = math.min(capacity, tokens + elapsed * rate)

if new_tokens < 1 then
    redis.call("HMSET", key, "tokens", new_tokens, "last_refill", now)
    redis.call("EXPIRE", key, 3600)
    return 0
end

redis.call("HMSET", key, "tokens", new_tokens - 1, "last_refill", now)
redis.call("EXPIRE", key, 3600)
return 1`;

const RATE_LIMIT_MIDDLEWARE = `import time
from fastapi import Request
from fastapi.responses import JSONResponse

# Load the Lua script once at startup
with open("token_bucket.lua") as f:
    BUCKET_SCRIPT = redis_client.register_script(f.read())

RATE_LIMIT_CAPACITY = 100   # tokens per user
RATE_LIMIT_RATE = 10        # tokens refilled per second


async def per_user_rate_limit(request: Request, call_next):
    current_user = getattr(request.state, "current_user", None)
    if current_user is None:
        return await call_next(request)

    key = f"ratelimit:{current_user.id}"
    allowed = await BUCKET_SCRIPT(
        keys=[key],
        args=[RATE_LIMIT_CAPACITY, RATE_LIMIT_RATE, int(time.time())],
    )

    if not allowed:
        return JSONResponse(
            status_code=429,
            headers={"Retry-After": "10"},
            content={"error": "Rate limit exceeded", "code": "RATE_LIMITED"},
        )

    return await call_next(request)`;

const COMPARISON = [
  {
    algorithm: "Fixed window",
    pros: "Trivially simple. One Redis counter with a TTL.",
    cons: "Allows 2x the limit at window boundaries. A user can exhaust the next window immediately after the current one resets.",
  },
  {
    algorithm: "Sliding window log",
    pros: "Perfectly smooth. No boundary spikes.",
    cons: "Stores every request timestamp. Memory grows with request rate. Expensive to clean up.",
  },
  {
    algorithm: "Token bucket",
    pros: "Smooth and memory-efficient. Handles burst traffic naturally (accumulated tokens).",
    cons: "Slightly more complex Lua script. No sharp window boundaries to communicate to clients.",
  },
  {
    algorithm: "Leaky bucket",
    pros: "Enforces a constant output rate. Good for smoothing bursty writes to downstream systems.",
    cons: "Does not allow burst absorption. A user who is under the average rate cannot temporarily burst.",
  },
];

export function RateLimitingSection() {
  return (
    <section id="rate-limiting">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Per-User Rate Limiting</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Article 6 added per-IP rate limiting on auth endpoints using slowapi. At 10k RPS,
        that is not enough. Data endpoints need per-user limits to prevent any single user
        from consuming a disproportionate share of capacity. The limit must be checked and
        updated atomically — without a Lua script, two simultaneous requests could both
        read the same counter value and both be allowed when only one should be.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The token bucket algorithm is the right choice for an API. Users accumulate tokens
        while idle and can burst up to the bucket capacity. A user who sends 10 requests
        in a second after being quiet for 10 seconds is using their accumulated allowance,
        not abusing the API.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          token_bucket.lua
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {TOKEN_BUCKET_LUA}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          main.py -- per-user rate limit middleware
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {RATE_LIMIT_MIDDLEWARE}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-4">Rate limiting algorithms compared</h3>

      <div className="space-y-3">
        {COMPARISON.map(({ algorithm, pros, cons }) => (
          <div key={algorithm} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{algorithm}</span>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1">Pros</p>
                <p className="text-muted-foreground leading-relaxed">{pros}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1">Cons</p>
                <p className="text-muted-foreground leading-relaxed">{cons}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
