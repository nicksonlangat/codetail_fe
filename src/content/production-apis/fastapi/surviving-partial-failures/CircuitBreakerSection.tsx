const CIRCUIT_CODE = `import asyncio
from enum import Enum
from datetime import datetime, timedelta


class CircuitState(Enum):
    CLOSED = "closed"      # normal -- requests flow through
    OPEN = "open"          # failing -- requests rejected immediately
    HALF_OPEN = "half_open"  # recovering -- one probe request allowed


class CircuitBreaker:
    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_timeout: int = 30,
        success_threshold: int = 2,
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.success_threshold = success_threshold

        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.opened_at: datetime | None = None

    async def call(self, fn, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            if self._should_attempt_recovery():
                self.state = CircuitState.HALF_OPEN
                self.success_count = 0
            else:
                raise CircuitOpenError("Circuit is open -- dependency unavailable")

        try:
            result = await fn(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise

    def _on_success(self):
        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1
            if self.success_count >= self.success_threshold:
                self.state = CircuitState.CLOSED
                self.failure_count = 0
        elif self.state == CircuitState.CLOSED:
            self.failure_count = 0

    def _on_failure(self):
        self.failure_count += 1
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
            self.opened_at = datetime.utcnow()

    def _should_attempt_recovery(self) -> bool:
        if self.opened_at is None:
            return False
        return datetime.utcnow() > self.opened_at + timedelta(
            seconds=self.recovery_timeout
        )


class CircuitOpenError(Exception):
    pass


# One breaker per dependency
redis_breaker = CircuitBreaker(failure_threshold=5, recovery_timeout=30)`;

const STATES = [
  {
    state: "Closed",
    description: "Normal operation. All requests flow through to Redis. Failures are counted.",
    transition: "Opens when failure_count reaches failure_threshold (default: 5).",
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    state: "Open",
    description: "Redis is assumed unavailable. All requests fail immediately without calling Redis.",
    transition: "Moves to Half-Open after recovery_timeout seconds (default: 30).",
    color: "text-destructive bg-destructive/10 border-destructive/20",
  },
  {
    state: "Half-Open",
    description: "Recovery probe. One request is allowed through to test if Redis has recovered.",
    transition: "Returns to Closed after success_threshold successes. Returns to Open on any failure.",
    color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
];

export function CircuitBreakerSection() {
  return (
    <section id="circuit-breaker">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Circuit Breaker</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A timeout protects against slow dependencies. A circuit breaker protects against
        dependencies that are consistently failing. After N consecutive failures, the
        circuit opens and subsequent calls return immediately without attempting the
        dependency — protecting the application from accumulating failed connections
        and allowing the dependency time to recover.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The circuit breaker has three states. The state machine transitions based on
        failure counts and a recovery timeout. The implementation below is ~50 lines;
        production systems often use a library like{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">pybreaker</code>{" "}
        or handle this at the infrastructure level (Envoy, Istio).
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          circuit_breaker.py (new file)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {CIRCUIT_CODE}
        </pre>
      </div>

      <div className="space-y-3">
        {STATES.map(({ state, description, transition, color }) => (
          <div key={state} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-semibold ${color}`}>
                {state}
              </span>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
              <p className="text-[11px]">
                <span className="font-medium text-foreground/80">Transition: </span>
                <span className="text-muted-foreground">{transition}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Circuit breakers should be per-dependency, not global</p>
        <p className="text-muted-foreground">
          A single circuit breaker for all external calls would open when any one dependency
          fails, blocking calls to healthy dependencies too. Create one breaker per
          dependency (one for Redis, one for any outbound HTTP service). The database
          typically does not need a circuit breaker because connection timeouts and pool
          limits already bound its failure blast radius.
        </p>
      </div>
    </section>
  );
}
