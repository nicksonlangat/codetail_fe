import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const LOAD_SHED_CODE = `from fastapi import Request
from fastapi.responses import JSONResponse

QUEUE_DEPTH_KEY = "celery:queue_depth"
MAX_QUEUE_DEPTH = 10_000  # reject new work above this threshold


async def load_shedding_middleware(request: Request, call_next):
    # Only shed load on write operations that enqueue background work.
    # Read operations bypass load shedding -- they do not add queue pressure.
    if request.method not in ("POST", "PUT", "PATCH"):
        return await call_next(request)

    try:
        queue_depth = await redis_client.llen("celery")
        if queue_depth > MAX_QUEUE_DEPTH:
            return JSONResponse(
                status_code=503,
                headers={"Retry-After": "30"},
                content={
                    "error": "Service temporarily overloaded",
                    "code": "OVERLOADED",
                    "queue_depth": queue_depth,
                },
            )
    except redis.RedisError:
        # If we cannot check the queue depth, let the request through.
        # Better to allow overload than to false-reject due to Redis error.
        pass

    return await call_next(request)`;

const LOAD_SHED_DIFF: DiffLine[] = [
  { type: "context", content: "app = FastAPI(title=\"Tasks API\", lifespan=lifespan)" },
  { type: "context", content: "app.middleware(\"http\")(logging_middleware)" },
  { type: "context", content: "app.middleware(\"http\")(security_headers_middleware)" },
  { type: "added",   content: "app.middleware(\"http\")(load_shedding_middleware)" },
];

const STRATEGIES = [
  {
    strategy: "Queue depth threshold",
    signal: "Celery queue length via Redis LLEN",
    reject: "Write operations that would add to queue",
    tradeoff: "Queue depth is a lagging indicator. It reflects how backed-up work already is, not how fast new work is arriving.",
  },
  {
    strategy: "CPU utilization",
    signal: "Process CPU usage via psutil",
    reject: "All requests when CPU > 90% for more than 10 seconds",
    tradeoff: "CPU is a direct signal but requires per-process monitoring. In a multi-instance deployment, each instance sheds independently.",
  },
  {
    strategy: "Active connection count",
    signal: "Pool connections in use / pool size",
    reject: "Requests when pool utilization > 80%",
    tradeoff: "Protects the database from connection exhaustion but does not protect against CPU overload.",
  },
];

export function LoadSheddingSection() {
  return (
    <section id="load-shedding">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Load Shedding</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Rate limiting controls how much traffic any single user can send. Load shedding
        controls how much traffic the system accepts in total when it is overloaded. Without
        load shedding, a traffic spike that exceeds capacity causes every request to slow
        down and eventually time out. With load shedding, a fraction of requests receive
        an immediate 503, and the rest are served normally.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A 503 is better than a timeout. The client receives a response immediately,
        can read the{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">Retry-After</code>{" "}
        header, and retry at the right time. A timeout leaves the client waiting and
        then failing with no information. The system also frees the connection slot
        immediately rather than holding it for the full timeout duration.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          main.py -- queue-depth load shedding
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {LOAD_SHED_CODE}
        </pre>
      </div>

      <CodeDiff filename="main.py" before="" after="" diff={LOAD_SHED_DIFF} />

      <h3 className="text-base font-semibold mt-8 mb-4">Load shedding signals</h3>

      <div className="space-y-3">
        {STRATEGIES.map(({ strategy, signal, reject, tradeoff }) => (
          <div key={strategy} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{strategy}</span>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 gap-3 text-[11px]">
              <div className="space-y-2">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-0.5">Signal</p>
                  <p className="text-muted-foreground">{signal}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-0.5">Reject</p>
                  <p className="text-muted-foreground">{reject}</p>
                </div>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-0.5">Tradeoff</p>
                <p className="text-muted-foreground">{tradeoff}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
