import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const SESSION_BEFORE = `# Sessions stored in-process (wrong)
from starlette.middleware.sessions import SessionMiddleware

app.add_middleware(
    SessionMiddleware,
    secret_key=SECRET_KEY,
    # Sessions live in a signed cookie backed by nothing persistent.
    # Each app instance has independent session state.
    # A user routed to instance B cannot access a session created on instance A.
)`;

const SESSION_AFTER = `# Sessions stored in Redis (correct)
# JWT tokens are already stateless -- no session middleware needed.
# File uploads go to S3/R2, not the local filesystem.
# No in-process caches that differ between instances.

# The only state the app holds:
# - Active database connections (pooled, not shared across instances)
# - Active Redis connections (pooled, not shared across instances)
# Both are re-created per instance at startup.

# What does NOT go in process:
# - User sessions (use JWT or Redis-backed sessions)
# - Uploaded files (use object storage)
# - Rate limit counters (use Redis)
# - Task queues (use Redis-backed Celery)`;

const DOCKER_COMPOSE = `# docker-compose.yml (horizontal scaling example)
services:
  api:
    image: tasks-api:latest
    deploy:
      replicas: 4      # 4 identical, stateless instances
    environment:
      DATABASE_URL: postgresql+asyncpg://...
      REDIS_URL: redis://redis:6379
      CELERY_BROKER_URL: redis://redis:6379/1
    depends_on:
      - db
      - redis

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    # Round-robin load balancing across 4 API instances`;

const STATELESS_DIFF: DiffLine[] = [
  { type: "removed", content: "from starlette.middleware.sessions import SessionMiddleware" },
  { type: "context", content: "" },
  { type: "removed", content: "app.add_middleware(" },
  { type: "removed", content: "    SessionMiddleware," },
  { type: "removed", content: "    secret_key=SECRET_KEY," },
  { type: "removed", content: ")" },
  { type: "added",   content: "# JWT tokens are stateless -- no session middleware required." },
  { type: "added",   content: "# Rate limit state -> Redis. Uploads -> S3. Queue state -> Redis." },
];

export function StatelessSection() {
  return (
    <section id="stateless">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Making the App Stateless</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Horizontal scaling requires every instance of the app to be interchangeable. A
        request routed to instance A must produce the same result as the same request
        routed to instance B. This is impossible if any instance holds state that others
        do not: in-process sessions, local filesystem uploads, in-process rate limit
        counters.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The current API is already mostly stateless because article 4 chose JWTs (stateless
        tokens) over server-side sessions. The remaining work is ensuring file uploads
        go to object storage, rate limit counters live in Redis, and task queue state lives
        in the Celery broker — not in any single instance.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          main.py -- stateless checklist
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {SESSION_AFTER}
        </pre>
      </div>

      <CodeDiff filename="main.py" before={SESSION_BEFORE} after="" diff={STATELESS_DIFF} />

      <div className="bg-card border border-border rounded-xl p-4 mt-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          docker-compose.yml -- 4 stateless replicas
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {DOCKER_COMPOSE}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Stateless does not mean memory-free</p>
        <p className="text-muted-foreground">
          Each instance maintains a database connection pool and a Redis connection pool.
          These are instance-local and that is correct — connection pools are not shared
          state, they are local infrastructure. The distinction is whether the state affects
          correctness. A connection pool is not shared with other instances and has no
          impact on request routing. A session store must be shared because session lookup
          must work regardless of which instance handles the request.
        </p>
      </div>
    </section>
  );
}
