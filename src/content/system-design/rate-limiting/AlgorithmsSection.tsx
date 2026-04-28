import { RateLimiterSimulator } from "@/components/blog/interactive/rate-limiter-simulator";

const ALGORITHM_COMPARISON = [
  {
    algo: "Token Bucket",
    burst: "Yes — up to capacity",
    memory: "O(1) per client",
    accuracy: "Exact",
    complexity: "Low",
    bestFor: "APIs where bursts are acceptable: upload endpoints, webhook delivery",
    weakness: "Burst at start: new clients immediately get full capacity",
  },
  {
    algo: "Leaky Bucket",
    burst: "No — constant output rate",
    memory: "O(1) per client",
    accuracy: "Exact",
    complexity: "Low",
    bestFor: "Smooth traffic to downstream: protecting a database, payment processor",
    weakness: "Queue buildup under sustained load; adds latency before rejection",
  },
  {
    algo: "Fixed Window",
    burst: "Yes — at window boundary",
    memory: "O(1) per client",
    accuracy: "Approximate",
    complexity: "Very low",
    bestFor: "Simple quota enforcement: API keys with daily/hourly limits",
    weakness: "Boundary burst: 2x limit possible across a window reset",
  },
  {
    algo: "Sliding Window Log",
    burst: "Controlled",
    memory: "O(requests in window) per client",
    accuracy: "Exact",
    complexity: "Medium",
    bestFor: "Precise rate limiting where boundary bursts are unacceptable",
    weakness: "Memory grows with request count; expensive at high volume",
  },
  {
    algo: "Sliding Window Counter",
    burst: "Controlled",
    memory: "O(1) per client",
    accuracy: "Approximate",
    complexity: "Low",
    bestFor: "Best of both: accurate enough, memory-efficient",
    weakness: "Slightly under-counts requests at window boundaries (smoothed approximation)",
  },
];

export function AlgorithmsSection() {
  return (
    <section>
      <h2 id="algorithms" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Rate Limiting Algorithms
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Rate limiting algorithms differ in how they track usage over time and how they handle
        bursts. The choice affects memory usage, accuracy at window boundaries, and whether
        you allow short bursts above the average rate. The three most important to understand
        are token bucket, fixed window, and sliding window.
      </p>

      <RateLimiterSimulator />

      <h3 className="text-base font-semibold mt-4 mb-3">Token bucket</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The token bucket holds a maximum of N tokens. Tokens are added at a fixed rate
        (R per second). Each request consumes one token. If the bucket has tokens, the
        request is allowed. If empty, it is rejected. The bucket accumulates tokens while
        traffic is low, enabling bursts up to capacity when traffic spikes.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        This is the algorithm behind most production rate limiters because burst handling
        maps to real-world usage: a user typing quickly generates short bursts of API calls,
        while a background job makes steady calls over time. Both are valid. Token bucket
        handles both correctly with one parameter set.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">Token bucket in Redis (Lua script)</p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Called atomically via EVAL
local key        = KEYS[1]
local capacity   = tonumber(ARGV[1])   -- max tokens
local refill_rate = tonumber(ARGV[2])  -- tokens per second
local now        = tonumber(ARGV[3])   -- current Unix timestamp (ms)
local cost       = tonumber(ARGV[4])   -- tokens this request costs

local bucket = redis.call("HMGET", key, "tokens", "last_refill")
local tokens     = tonumber(bucket[1]) or capacity
local last_refill = tonumber(bucket[2]) or now

-- Refill tokens based on elapsed time
local elapsed = (now - last_refill) / 1000
tokens = math.min(capacity, tokens + elapsed * refill_rate)

if tokens >= cost then
  tokens = tokens - cost
  redis.call("HMSET", key, "tokens", tokens, "last_refill", now)
  redis.call("EXPIRE", key, 3600)
  return 1   -- allowed
else
  redis.call("HMSET", key, "tokens", tokens, "last_refill", now)
  redis.call("EXPIRE", key, 3600)
  return 0   -- rejected
end`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Fixed window</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Fixed window increments a counter for the current time window. The counter resets
        when the window expires. Implementation is a single Redis INCR with an expiry:
        trivially simple and extremely fast.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The weakness is the boundary burst. With a limit of 100/minute, a client can send
        100 requests in the last second of minute 1 and 100 in the first second of minute 2
        — 200 requests in 2 seconds without violating the limit. If your system cannot handle
        a 2x burst, fixed window is insufficient.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">Fixed window in Redis</p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`def is_allowed(user_id: str, limit: int, window_sec: int) -> bool:
    now = int(time.time())
    window_key = now // window_sec   # floor to window boundary
    key = f"rl:{user_id}:{window_key}"

    count = redis.incr(key)
    if count == 1:
        redis.expire(key, window_sec * 2)  # safety: 2x TTL
    return count <= limit`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Sliding window</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Sliding window eliminates the boundary burst by tracking the exact time of each
        request within the window. On each request, timestamps older than
        (now - window_size) are removed. If the remaining count is below the limit, the
        request is allowed and its timestamp recorded.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The sliding window counter approximation is more practical at scale: instead of
        storing every timestamp, it combines the current window's counter with the previous
        window's counter, weighted by how much of the previous window overlaps with the
        current sliding window. This trades marginal accuracy for O(1) memory.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Algorithm comparison</h3>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              {["Algorithm", "Burst", "Memory", "Accuracy", "Complexity", "Best for"].map(h => (
                <th key={h} className="text-left py-2 pr-3 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {ALGORITHM_COMPARISON.map(({ algo, burst, memory, accuracy, complexity, bestFor }) => (
              <tr key={algo}>
                <td className="py-2.5 pr-3 font-semibold text-foreground/80 align-top whitespace-nowrap">{algo}</td>
                <td className="py-2.5 pr-3 text-muted-foreground align-top">{burst}</td>
                <td className="py-2.5 pr-3 font-mono text-[10px] align-top">{memory}</td>
                <td className="py-2.5 pr-3 text-muted-foreground align-top">{accuracy}</td>
                <td className="py-2.5 pr-3 text-muted-foreground align-top">{complexity}</td>
                <td className="py-2.5 text-muted-foreground align-top">{bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
