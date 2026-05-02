import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const DB_TIMEOUT_BEFORE = `from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
)`;

const DB_TIMEOUT_AFTER = `from sqlalchemy.ext.asyncio import create_async_engine
import asyncio

engine = create_async_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_timeout=5,        # wait up to 5s for a pool slot
    connect_args={
        "command_timeout": 3,  # kill any query taking over 3s
        "timeout": 5,          # connection timeout
    },
)


async def db_execute_with_timeout(session, stmt, timeout: float = 3.0):
    try:
        return await asyncio.wait_for(session.execute(stmt), timeout=timeout)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=503, detail="Database timeout")`;

const DB_DIFF: DiffLine[] = [
  { type: "context", content: "engine = create_async_engine(" },
  { type: "context", content: "    DATABASE_URL," },
  { type: "context", content: "    pool_size=10," },
  { type: "context", content: "    max_overflow=20," },
  { type: "added",   content: "    pool_timeout=5," },
  { type: "added",   content: "    connect_args={" },
  { type: "added",   content: "        \"command_timeout\": 3," },
  { type: "added",   content: "        \"timeout\": 5," },
  { type: "added",   content: "    }," },
  { type: "context", content: ")" },
];

const REDIS_TIMEOUT = `redis_client = redis.from_url(
    REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
    socket_timeout=1.0,          # read/write timeout
    socket_connect_timeout=1.0,  # connection timeout
    retry_on_timeout=False,      # handled by circuit breaker instead
)`;

const TIMEOUT_TABLE = [
  { name: "pool_timeout", value: "5s", purpose: "How long to wait for a free connection from the pool before giving up" },
  { name: "command_timeout", value: "3s", purpose: "Maximum time any single database query may run before asyncpg cancels it" },
  { name: "socket_timeout (Redis)", value: "1s", purpose: "Maximum time to wait for a Redis read or write operation" },
  { name: "socket_connect_timeout", value: "1s", purpose: "Maximum time to establish a new TCP connection to Redis" },
];

export function TimeoutsSection() {
  return (
    <section id="timeouts">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Timeouts on Every Call</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Every call to an external dependency needs a timeout. The question is not whether
        the dependency will be slow — it will. The question is whether your API should
        wait indefinitely or fail fast and free the connection pool for other requests.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        For the database, set timeouts at two layers: pool acquisition (how long to wait
        for a connection slot) and query execution (how long a query may run before being
        cancelled). For Redis, set socket timeouts at connection initialization time.
      </p>

      <CodeDiff filename="database.py" before={DB_TIMEOUT_BEFORE} after={DB_TIMEOUT_AFTER} diff={DB_DIFF} />

      <div className="bg-card border border-border rounded-xl p-4 mt-6 mb-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          cache.py -- Redis with socket timeouts
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {REDIS_TIMEOUT}
        </pre>
      </div>

      <div className="space-y-2 mt-6">
        {TIMEOUT_TABLE.map(({ name, value, purpose }) => (
          <div key={name} className="flex gap-3 items-start p-3 bg-card border border-border rounded-xl">
            <code className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded shrink-0 mt-0.5">{value}</code>
            <div>
              <code className="text-[11px] font-mono font-semibold">{name}</code>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{purpose}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Timeout values are traffic-dependent</p>
        <p className="text-muted-foreground">
          A 3-second query timeout is generous for simple indexed reads but too short for
          aggregate queries on large tables. Set timeouts based on the p99 of your actual
          query distribution, not a round number. Too short means false timeouts on legitimate
          slow queries. Too long means slow dependencies still cascade. Check the slow query
          log from article 3 to anchor your values.
        </p>
      </div>
    </section>
  );
}
