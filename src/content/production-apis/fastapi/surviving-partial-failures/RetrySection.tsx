const TENACITY_CODE = `from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    before_sleep_log,
)
import logging
import asyncpg

logger = logging.getLogger(__name__)


# Only retry idempotent operations (reads).
# Never retry POST, PATCH, DELETE.
@retry(
    retry=retry_if_exception_type((asyncpg.TooManyConnectionsError, asyncio.TimeoutError)),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=0.1, min=0.1, max=2.0),
    before_sleep=before_sleep_log(logger, logging.WARNING),
    reraise=True,
)
async def fetch_task_with_retry(db: AsyncSession, task_id: int, user_id: int):
    task = await db.get(Task, task_id)
    if not task or task.user_id != user_id:
        return None
    return task`;

const JITTER_CODE = `import random

# Exponential backoff with jitter prevents the thundering herd problem.
# Without jitter, all retrying clients hit the dependency at the same
# time after the same wait interval.

def backoff_with_jitter(attempt: int, base: float = 0.1, cap: float = 2.0) -> float:
    exp = min(base * (2 ** attempt), cap)
    return random.uniform(0, exp)`;

const RETRY_RULES = [
  {
    rule: "Only retry idempotent operations",
    why: "Retrying a POST /tasks on a transient error creates duplicate tasks if the first request succeeded and only the response was lost. GET, HEAD are safe to retry. POST, PATCH, DELETE are not.",
  },
  {
    rule: "Add jitter to backoff",
    why: "Without jitter, all clients that failed at the same moment retry at the same moment. Jitter spreads the retry load across time, preventing the thundering herd from overwhelming a recovering dependency.",
  },
  {
    rule: "Set a maximum attempt count",
    why: "Infinite retries hold a connection slot indefinitely. Three attempts with exponential backoff (100ms, 200ms, 400ms total wait ~700ms) is a reasonable default for transient errors.",
  },
  {
    rule: "Only retry on retriable exception types",
    why: "Retrying on a 404 or a 403 is wrong — those are not transient errors. Configure retry to trigger only on connection errors, timeout errors, and pool exhaustion errors.",
  },
];

export function RetrySection() {
  return (
    <section id="retry">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Retry with Exponential Backoff</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Transient failures — a momentary TCP reset, a brief DNS hiccup, a connection pool
        spike — are normal in distributed systems. Without retry logic, every transient
        failure becomes a user-visible error. With retry logic on idempotent operations,
        the same failures become invisible.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">tenacity</code>{" "}
        is the standard Python retry library. It supports exponential backoff, jitter,
        attempt limits, and per-exception-type retry conditions with a decorator interface.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          requirements.txt + retry-wrapped database read
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {`tenacity==8.2.3  # retry library with exponential backoff\n\n`}{TENACITY_CODE}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          manual jitter implementation
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {JITTER_CODE}
        </pre>
      </div>

      <div className="space-y-3">
        {RETRY_RULES.map(({ rule, why }) => (
          <div key={rule} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{rule}</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed">{why}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
