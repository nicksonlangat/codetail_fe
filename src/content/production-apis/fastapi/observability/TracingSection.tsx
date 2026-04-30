import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const TELEMETRY_CODE = `from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor


def configure_tracing(app, engine):
    provider = TracerProvider()
    provider.add_span_processor(
        BatchSpanProcessor(
            OTLPSpanExporter(endpoint="http://localhost:4317", insecure=True)
        )
    )
    trace.set_tracer_provider(provider)

    FastAPIInstrumentor.instrument_app(app)
    SQLAlchemyInstrumentor().instrument(engine=engine.sync_engine)`;

const MAIN_BEFORE = `from fastapi import FastAPI, Depends, HTTPException, status, Query, Request
from contextlib import asynccontextmanager
from database import get_db, init_db, engine
from middleware import logging_middleware
from logging_config import configure_logging
from prometheus_fastapi_instrumentator import Instrumentator

@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    await init_db()
    yield

app = FastAPI(title="Tasks API", lifespan=lifespan)
app.middleware("http")(logging_middleware)
Instrumentator().instrument(app).expose(app, endpoint="/metrics")`;

const MAIN_AFTER = `from fastapi import FastAPI, Depends, HTTPException, status, Query, Request
from contextlib import asynccontextmanager
from database import get_db, init_db, engine
from middleware import logging_middleware
from logging_config import configure_logging
from prometheus_fastapi_instrumentator import Instrumentator
from telemetry import configure_tracing

@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    configure_tracing(app, engine)
    await init_db()
    yield

app = FastAPI(title="Tasks API", lifespan=lifespan)
app.middleware("http")(logging_middleware)
Instrumentator().instrument(app).expose(app, endpoint="/metrics")`;

const MAIN_DIFF: DiffLine[] = [
  { type: "context", content: "from fastapi import FastAPI, Depends, HTTPException, status, Query, Request" },
  { type: "context", content: "from contextlib import asynccontextmanager" },
  { type: "context", content: "from database import get_db, init_db, engine" },
  { type: "context", content: "from middleware import logging_middleware" },
  { type: "context", content: "from logging_config import configure_logging" },
  { type: "context", content: "from prometheus_fastapi_instrumentator import Instrumentator" },
  { type: "added",   content: "from telemetry import configure_tracing" },
  { type: "context", content: "" },
  { type: "context", content: "@asynccontextmanager" },
  { type: "context", content: "async def lifespan(app: FastAPI):" },
  { type: "context", content: "    configure_logging()" },
  { type: "added",   content: "    configure_tracing(app, engine)" },
  { type: "context", content: "    await init_db()" },
  { type: "context", content: "    yield" },
];

const MANUAL_SPAN = `import structlog
from opentelemetry import trace

tracer = trace.get_tracer(__name__)
logger = structlog.get_logger()


async def fetch_tasks_with_tracing(
    db: AsyncSession,
    user_id: int,
    cursor: datetime | None,
    limit: int,
) -> list[Task]:
    with tracer.start_as_current_span("db.fetch_tasks") as span:
        span.set_attribute("db.user_id", user_id)
        span.set_attribute("db.limit", limit)

        stmt = (
            select(Task)
            .where(Task.user_id == user_id)
            .order_by(Task.created_at.desc())
            .limit(limit + 1)
        )
        if cursor:
            stmt = stmt.where(Task.created_at < cursor)

        result = await db.execute(stmt)
        tasks = result.scalars().all()

        span.set_attribute("db.rows_returned", len(tasks))
        return tasks`;

const TRACE_LOG_MIDDLEWARE = `from opentelemetry import trace as otel_trace

async def logging_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())[:8]
    start = time.monotonic()

    # include the active trace ID so logs and traces are correlated
    span = otel_trace.get_current_span()
    trace_id = format(span.get_span_context().trace_id, "032x") if span else ""

    bound = logger.bind(
        request_id=request_id,
        trace_id=trace_id,
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

export function TracingSection() {
  return (
    <section id="tracing">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        OpenTelemetry Tracing
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Four new dependencies add distributed tracing. Auto-instrumentation handles FastAPI
        routes and SQLAlchemy queries without any per-handler code -- every request
        automatically gets a root span, and every database query becomes a child span inside it.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          requirements.txt -- additions
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3">
{`opentelemetry-sdk==1.22.0                          # core SDK
opentelemetry-instrumentation-fastapi==0.43b0       # auto-instrument routes
opentelemetry-instrumentation-sqlalchemy==0.43b0    # auto-instrument queries
opentelemetry-exporter-otlp==1.22.0                 # export to Jaeger / Grafana Tempo`}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          telemetry.py (new file)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {TELEMETRY_CODE}
        </pre>
      </div>

      <CodeDiff filename="main.py" before={MAIN_BEFORE} after={MAIN_AFTER} diff={MAIN_DIFF} />

      <h3 className="text-base font-semibold mt-8 mb-3">Manual spans for slow operations</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Auto-instrumentation captures every query but not the logic around it. A manual span
        on a specific operation shows exactly which step is slow within the handler -- useful
        when you suspect query construction, cache miss logic, or serialization is the bottleneck.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          manual span on the list query
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {MANUAL_SPAN}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Correlating logs and traces</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A trace ID in every log line is what connects the two systems. Update the middleware
        to read the active span context and bind its trace ID alongside the request ID.
        In Grafana, you can click a log line and jump directly to the corresponding trace.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          middleware.py -- add trace_id to log context
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {TRACE_LOG_MIDDLEWARE}
        </pre>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
          <p className="font-semibold text-foreground/80">OTLP endpoint in development vs production</p>
          <p className="text-muted-foreground">
            The{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">localhost:4317</code>{" "}
            endpoint points to a local Jaeger instance (run via Docker). In production, point it at
            your collector -- Grafana Tempo, Honeycomb, or a self-hosted OpenTelemetry Collector that
            fans out to multiple backends. The code does not change between environments; only the
            <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]"> OTEL_EXPORTER_OTLP_ENDPOINT</code>{" "}
            environment variable does.
          </p>
        </div>

        <div className="p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
          <p className="font-semibold text-foreground/80">SQLAlchemyInstrumentor needs the sync engine</p>
          <p className="text-muted-foreground">
            The async SQLAlchemy engine wraps a synchronous engine internally.{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">SQLAlchemyInstrumentor</code>{" "}
            instruments the sync layer, which is why{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">engine.sync_engine</code>{" "}
            is passed rather than{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">engine</code> directly.
            Passing the async engine silently fails -- queries are executed but no spans are produced.
          </p>
        </div>
      </div>
    </section>
  );
}
