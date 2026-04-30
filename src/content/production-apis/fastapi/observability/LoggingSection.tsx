import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const MIDDLEWARE_CODE = `import uuid
import time
import structlog

logger = structlog.get_logger()


async def logging_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())[:8]
    start = time.monotonic()

    bound = logger.bind(
        request_id=request_id,
        method=request.method,
        path=request.url.path,
    )
    request.state.logger = bound
    request.state.request_id = request_id

    response = await call_next(request)

    duration_ms = round((time.monotonic() - start) * 1000, 1)
    bound.info("request", status=response.status_code, duration_ms=duration_ms)

    response.headers["X-Request-ID"] = request_id
    return response`;

const STRUCTLOG_CONFIG = `import logging
import structlog

def configure_logging():
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
    )`;

const MAIN_BEFORE = `from fastapi import FastAPI, Depends, HTTPException, status, Query
from contextlib import asynccontextmanager
from database import get_db, init_db

app = FastAPI(title="Tasks API")`;

const MAIN_AFTER = `from fastapi import FastAPI, Depends, HTTPException, status, Query, Request
from contextlib import asynccontextmanager
from database import get_db, init_db
from middleware import logging_middleware
from logging_config import configure_logging

app = FastAPI(title="Tasks API")
app.middleware("http")(logging_middleware)`;

const MAIN_DIFF: DiffLine[] = [
  { type: "removed", content: "from fastapi import FastAPI, Depends, HTTPException, status, Query" },
  { type: "added",   content: "from fastapi import FastAPI, Depends, HTTPException, status, Query, Request" },
  { type: "context", content: "from contextlib import asynccontextmanager" },
  { type: "context", content: "from database import get_db, init_db" },
  { type: "added",   content: "from middleware import logging_middleware" },
  { type: "added",   content: "from logging_config import configure_logging" },
  { type: "context", content: "" },
  { type: "context", content: "app = FastAPI(title=\"Tasks API\")" },
  { type: "added",   content: "app.middleware(\"http\")(logging_middleware)" },
];

const ENDPOINT_USAGE = `@app.get("/tasks", response_model=TaskListResponse)
async def list_tasks(
    request: Request,
    cursor: datetime | None = Query(default=None),
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    log = request.state.logger.bind(user_id=current_user.id)
    log.info("list_tasks.start", cursor=str(cursor) if cursor else None, limit=limit)

    stmt = (
        select(Task)
        .where(Task.user_id == current_user.id)
        .order_by(Task.created_at.desc())
        .limit(limit + 1)
    )
    if cursor:
        stmt = stmt.where(Task.created_at < cursor)
    result = await db.execute(stmt)
    tasks = result.scalars().all()
    has_more = len(tasks) > limit
    items = tasks[:limit]

    log.info("list_tasks.done", count=len(items), has_more=has_more)
    return TaskListResponse(
        items=items,
        next_cursor=items[-1].created_at if has_more else None,
    )`;

const LOG_OUTPUT = `{"timestamp": "2024-01-15T10:23:41.123Z", "level": "info", "event": "list_tasks.start", "request_id": "a3f9c1d2", "method": "GET", "path": "/tasks", "user_id": 42, "cursor": null, "limit": 20}
{"timestamp": "2024-01-15T10:23:41.127Z", "level": "info", "event": "list_tasks.done",  "request_id": "a3f9c1d2", "method": "GET", "path": "/tasks", "user_id": 42, "count": 20, "has_more": true}
{"timestamp": "2024-01-15T10:23:41.127Z", "level": "info", "event": "request",           "request_id": "a3f9c1d2", "method": "GET", "path": "/tasks", "status": 200, "duration_ms": 4.2}`;

export function LoggingSection() {
  return (
    <section id="structured-logging">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Structured Logging with Request IDs
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Two new dependencies replace ad-hoc{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">print</code>{" "}
        calls with machine-readable JSON logs.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          requirements.txt -- additions
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3">
{`structlog==24.1.0          # structured JSON logging with context binding
python-json-logger==2.0.7  # JSON formatter for stdlib logging integration`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The middleware runs on every request. It generates a short random{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">request_id</code>,
        binds it to a structlog logger, stores the logger on{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">request.state</code>,
        and emits a summary log line after the handler returns. Every log line
        produced by the handler inherits the bound context automatically.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          middleware.py (new file)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {MIDDLEWARE_CODE}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          logging_config.py (new file)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {STRUCTLOG_CONFIG}
        </pre>
      </div>

      <CodeDiff filename="main.py" before={MAIN_BEFORE} after={MAIN_AFTER} diff={MAIN_DIFF} />

      <h3 className="text-base font-semibold mt-8 mb-3">Using the logger in endpoints</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Retrieve the bound logger from{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">request.state.logger</code>{" "}
        and bind additional context. Every subsequent log call on this logger includes
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> request_id</code>,
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> method</code>,
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> path</code>, and any
        keys you bind -- with no repeated arguments.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          main.py -- updated list endpoint
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {ENDPOINT_USAGE}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          log output (one request, three lines)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed whitespace-pre-wrap">
          {LOG_OUTPUT}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Why short IDs, not full UUIDs</p>
        <p className="text-muted-foreground">
          The first 8 characters of a UUID4 have 4 billion possible values. For a request log
          that lives for 30 minutes on a low-traffic API, collisions are practically impossible.
          Short IDs fit comfortably in terminal output and are easy to grep. Return the full ID
          via the{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">X-Request-ID</code>{" "}
          header so clients can include it in bug reports.
        </p>
      </div>
    </section>
  );
}
