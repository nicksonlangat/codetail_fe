import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const SHUTDOWN_BEFORE = `from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import init_db, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Tasks API", lifespan=lifespan)`;

const SHUTDOWN_AFTER = `from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import init_db, engine
import asyncio
import signal
import logging

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()

    loop = asyncio.get_running_loop()
    shutdown_event = asyncio.Event()

    def handle_sigterm():
        logger.info("SIGTERM received -- beginning graceful shutdown")
        shutdown_event.set()

    loop.add_signal_handler(signal.SIGTERM, handle_sigterm)

    yield

    # Shutdown phase: wait for in-flight requests to complete.
    # Uvicorn will stop accepting new connections before this runs.
    if shutdown_event.is_set():
        logger.info("Waiting for in-flight requests to complete")
        await asyncio.sleep(5)  # grace period

    await engine.dispose()
    logger.info("Shutdown complete")


app = FastAPI(title="Tasks API", lifespan=lifespan)`;

const SHUTDOWN_DIFF: DiffLine[] = [
  { type: "context", content: "from fastapi import FastAPI" },
  { type: "context", content: "from contextlib import asynccontextmanager" },
  { type: "context", content: "from database import init_db, engine" },
  { type: "added",   content: "import asyncio" },
  { type: "added",   content: "import signal" },
  { type: "added",   content: "import logging" },
  { type: "context", content: "" },
  { type: "added",   content: "logger = logging.getLogger(__name__)" },
  { type: "context", content: "" },
  { type: "context", content: "" },
  { type: "context", content: "@asynccontextmanager" },
  { type: "context", content: "async def lifespan(app: FastAPI):" },
  { type: "context", content: "    await init_db()" },
  { type: "context", content: "" },
  { type: "added",   content: "    loop = asyncio.get_running_loop()" },
  { type: "added",   content: "    shutdown_event = asyncio.Event()" },
  { type: "context", content: "" },
  { type: "added",   content: "    def handle_sigterm():" },
  { type: "added",   content: "        logger.info(\"SIGTERM received -- beginning graceful shutdown\")" },
  { type: "added",   content: "        shutdown_event.set()" },
  { type: "context", content: "" },
  { type: "added",   content: "    loop.add_signal_handler(signal.SIGTERM, handle_sigterm)" },
  { type: "context", content: "" },
  { type: "context", content: "    yield" },
  { type: "context", content: "" },
  { type: "added",   content: "    if shutdown_event.is_set():" },
  { type: "added",   content: "        logger.info(\"Waiting for in-flight requests to complete\")" },
  { type: "added",   content: "        await asyncio.sleep(5)" },
  { type: "context", content: "" },
  { type: "added",   content: "    await engine.dispose()" },
  { type: "added",   content: "    logger.info(\"Shutdown complete\")" },
];

const UVICORN_CMD = `# Tell uvicorn to respect SIGTERM and use graceful shutdown timeout
uvicorn main:app \\
  --host 0.0.0.0 \\
  --port 8000 \\
  --timeout-graceful-shutdown 10`;

export function GracefulShutdownSection() {
  return (
    <section id="graceful-shutdown">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Graceful Shutdown</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A graceful shutdown has three phases. First, stop accepting new requests (the load
        balancer stops routing traffic to this instance). Second, wait for in-flight requests
        to complete. Third, clean up resources (close database connections, flush logs) and
        exit. Without a SIGTERM handler, the process skips phases two and three.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        FastAPI's{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">lifespan</code>{" "}
        context manager runs code before{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">yield</code>{" "}
        on startup and after{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">yield</code>{" "}
        on shutdown. Uvicorn stops accepting new connections before the shutdown phase
        runs, so the sleep gives existing handlers time to complete their database
        transactions and return responses.
      </p>

      <CodeDiff filename="main.py" before={SHUTDOWN_BEFORE} after={SHUTDOWN_AFTER} diff={SHUTDOWN_DIFF} />

      <div className="bg-card border border-border rounded-xl p-4 mt-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          uvicorn startup command
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {UVICORN_CMD}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">The grace period must be shorter than the load balancer timeout</p>
        <p className="text-muted-foreground">
          If the grace period is 30 seconds but the load balancer's backend connection timeout is
          15 seconds, clients will receive errors before the process finishes draining. Set the
          grace period to match your p99 request duration plus a small buffer (p99 + 2 seconds
          is a good starting point). For this API, with p99 under 200ms, a 5-second grace
          period is generous.
        </p>
      </div>
    </section>
  );
}
