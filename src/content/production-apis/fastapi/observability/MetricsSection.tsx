import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const MAIN_BEFORE = `from fastapi import FastAPI, Depends, HTTPException, status, Query, Request
from contextlib import asynccontextmanager
from database import get_db, init_db
from middleware import logging_middleware
from logging_config import configure_logging

app = FastAPI(title="Tasks API")
app.middleware("http")(logging_middleware)`;

const MAIN_AFTER = `from fastapi import FastAPI, Depends, HTTPException, status, Query, Request
from contextlib import asynccontextmanager
from database import get_db, init_db
from middleware import logging_middleware
from logging_config import configure_logging
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI(title="Tasks API")
app.middleware("http")(logging_middleware)
Instrumentator().instrument(app).expose(app, endpoint="/metrics")`;

const MAIN_DIFF: DiffLine[] = [
  { type: "context", content: "from fastapi import FastAPI, Depends, HTTPException, status, Query, Request" },
  { type: "context", content: "from contextlib import asynccontextmanager" },
  { type: "context", content: "from database import get_db, init_db" },
  { type: "context", content: "from middleware import logging_middleware" },
  { type: "context", content: "from logging_config import configure_logging" },
  { type: "added",   content: "from prometheus_fastapi_instrumentator import Instrumentator" },
  { type: "context", content: "" },
  { type: "context", content: "app = FastAPI(title=\"Tasks API\")" },
  { type: "context", content: "app.middleware(\"http\")(logging_middleware)" },
  { type: "added",   content: "Instrumentator().instrument(app).expose(app, endpoint=\"/metrics\")" },
];

const CUSTOM_METRICS = `from prometheus_client import Counter, Histogram

auth_failure_counter = Counter(
    "api_auth_failures_total",
    "Total number of authentication failures",
    ["reason"],  # label values: expired_token, invalid_token, wrong_password
)

db_query_histogram = Histogram(
    "api_db_query_duration_seconds",
    "Database query duration in seconds",
    ["operation"],  # label values: list_tasks, get_task, create_task
    buckets=[0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1.0],
)`;

const AUTH_COUNTER_USAGE = `async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM]
        )
        user_id = int(payload["sub"])
    except JWTError:
        auth_failure_counter.labels(reason="expired_token").inc()
        raise exc
    except (KeyError, ValueError):
        auth_failure_counter.labels(reason="invalid_token").inc()
        raise exc

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        auth_failure_counter.labels(reason="user_not_found").inc()
        raise exc
    return user`;

const METRICS_SAMPLE = `# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{handler="/tasks",method="GET",status="2xx"} 8431.0
http_requests_total{handler="/tasks",method="POST",status="2xx"} 312.0
http_requests_total{handler="/tasks/{task_id}",method="GET",status="4xx"} 18.0

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{handler="/tasks",le="0.005"} 7204.0
http_request_duration_seconds_bucket{handler="/tasks",le="0.01"}  8102.0
http_request_duration_seconds_bucket{handler="/tasks",le="0.025"} 8398.0
http_request_duration_seconds_p50{handler="/tasks"} 0.0038
http_request_duration_seconds_p95{handler="/tasks"} 0.0094

# HELP api_auth_failures_total Total number of authentication failures
# TYPE api_auth_failures_total counter
api_auth_failures_total{reason="expired_token"}  23.0
api_auth_failures_total{reason="invalid_token"}   7.0
api_auth_failures_total{reason="user_not_found"}  1.0`;

export function MetricsSection() {
  return (
    <section id="metrics">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Prometheus Metrics
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        One new dependency and one line wires up automatic HTTP metrics. The
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> prometheus-fastapi-instrumentator</code>{" "}
        library instruments every route automatically: it records request counts, status
        code distributions, and latency histograms per endpoint, and exposes them at{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">/metrics</code> in
        the Prometheus text format.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          requirements.txt -- addition
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3">
{`prometheus-fastapi-instrumentator==6.1.0  # automatic HTTP metrics + /metrics endpoint`}
        </pre>
      </div>

      <CodeDiff filename="main.py" before={MAIN_BEFORE} after={MAIN_AFTER} diff={MAIN_DIFF} />

      <h3 className="text-base font-semibold mt-8 mb-3">Custom metrics</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Automatic HTTP metrics tell you how many requests succeeded and how long they took.
        Custom metrics tell you about business-level events. The two most useful types are
        counters (monotonically increasing totals) and histograms (latency distributions
        with configurable buckets).
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          metrics.py (new file)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {CUSTOM_METRICS}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          auth.py -- increment counter on each failure path
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {AUTH_COUNTER_USAGE}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">What /metrics returns</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          GET /metrics (excerpt)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {METRICS_SAMPLE}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mt-4">
        {[
          {
            metric: "http_requests_total",
            what: "Request count by handler, method, status class",
            alert: "Alert when 5xx rate exceeds 1% over 5 minutes",
          },
          {
            metric: "http_request_duration_seconds",
            what: "Latency histogram per endpoint, queryable as p50/p95/p99",
            alert: "Alert when p95 > 500ms for any handler",
          },
          {
            metric: "api_auth_failures_total",
            what: "Auth failures broken down by reason label",
            alert: "Alert when expired_token rate spikes (session issues)",
          },
        ].map(({ metric, what, alert }) => (
          <div key={metric} className="p-3 rounded-xl border border-border bg-card">
            <p className="text-[10px] font-mono font-semibold mb-1.5 text-foreground/80">{metric}</p>
            <p className="text-[10px] text-muted-foreground mb-2">{what}</p>
            <p className="text-[9px] font-mono bg-muted px-2 py-1 rounded text-foreground/60">{alert}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Protect /metrics from public access</p>
        <p className="text-muted-foreground">
          The <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">/metrics</code> endpoint
          leaks internal details: handler names, status distributions, counter labels. In production,
          restrict it to internal network access only (a sidecar scraper on localhost, or an IP allowlist
          on the load balancer). Do not expose it on the public-facing port.
        </p>
      </div>
    </section>
  );
}
