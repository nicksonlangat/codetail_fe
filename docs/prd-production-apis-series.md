# PRD: Production-Ready APIs — Stack-Specific System Design Series

**Status:** Draft  
**Author:** Codetail  
**Created:** 2026-04-28  
**Updated:** 2026-04-29  
**Target start:** After System Design & Architecture series (articles 8-15) is complete  

---

## 1. Vision

A blog series where readers build a real API from scratch and watch it evolve under progressively tighter production constraints. Every article introduces a new constraint — latency, throughput, availability, resilience — and shows the exact code changes needed to satisfy it.

The format is constraint-driven, not concept-driven. Readers see working code break under a real constraint, understand why it breaks, and see the specific fix. By the end of the series they have a mental model for how production systems are actually built: not designed upfront, but evolved under pressure.

This is fundamentally different from the existing System Design series (theory with interactive diagrams) and from tutorial-style articles (build a CRUD app). This series sits in between: production-grade concepts grounded in real, runnable code.

---

## 2. Target Audience

- Backend engineers with 1-4 years of experience
- Engineers who can write a working API but have not operated one at scale
- Engineers switching stacks who want to see how production patterns translate
- Engineers preparing for senior/staff interviews who need to articulate tradeoffs in code

---

## 3. Series Structure

### Three stacks, same constraint arc

Each stack gets its own independent sub-series. The constraint progression is identical across stacks so readers can compare how the same problem is solved in Python (FastAPI), Python (Django), and Go.

**Stacks:**
1. **FastAPI** — async Python, Pydantic, SQLAlchemy async, Alembic
2. **Django** — sync/async Django, DRF, Django ORM, Celery
3. **Go** — net/http or Gin, sqlx/pgx, goroutines

### Sequencing

Start with FastAPI. Validate the format with 10 articles. Then replicate the progression for Django and Go, using the FastAPI articles as the reference implementation.

Running all three stacks in parallel before the format is proven risks three underperforming series instead of one excellent one.

---

## 4. Constraint Arc (per stack)

Each stack follows a ten-article progression. The baseline API is identical in spirit across stacks (same 3 endpoints, same data model) but written idiomatically for each.

### The baseline API

A task management API with three endpoints:
- `POST /tasks` — create a task
- `GET /tasks/{id}` — fetch a task by ID
- `GET /tasks` — list tasks (paginated)

Intentionally minimal: SQLite, synchronous where possible, no caching, no auth, no error handling beyond 500s. This is the "it works on my laptop" starting point.

---

### Article 1: The Baseline

**Constraint introduced:** None. Ship it.

**What the article covers:**
- Project setup, dependencies, database schema
- The three endpoints implemented naively
- Running the app, basic smoke test
- Identifying what will break first (foreshadowing)

**Code state:** SQLite, sync endpoints, no connection pooling, no error handling, no health check

**Interactive:** Live code viewer with syntax highlighting, endpoint request/response demo

---

### Article 2: 100 Concurrent Users

**Constraint:** The app must handle 100 concurrent requests without errors or timeouts.

**What breaks:** SQLite cannot handle concurrent writes. Sync endpoints block the event loop (FastAPI). Connection pool exhausted immediately (Django). No health check means load balancer does not know the app is up.

**What changes:**
- SQLite to PostgreSQL
- Connection pooling (asyncpg for FastAPI, psycopg2 pooling for Django, pgx for Go)
- Async endpoint rewrite (FastAPI)
- Basic `/health` endpoint

**Before/after diff:** Highlighted inline diff showing exactly what changed

**Benchmark:** Simulated chart showing p50/p95/p99 latency before and after

**Code state:** Postgres, connection pool, async, `/health`

---

### Article 3: Slow Queries

**Constraint:** GET /tasks p95 exceeds 500ms once the table grows past 10,000 rows.

**What breaks:** The list endpoint does a full table scan. Offset pagination gets slower the further into the result set you go. No tooling to identify which queries are slow before users notice.

**What changes:**
- Slow query log configuration (Postgres `log_min_duration_statement`)
- `EXPLAIN ANALYZE` walkthrough: how to read a query plan, what a sequential scan means, when an index scan is used
- Composite index on `(user_id, created_at DESC)` for the list endpoint
- Cursor-based pagination replacing offset (eliminates the O(n) skip cost)
- N+1 query detection: what it is, how to spot it in logs, how to fix it with a join or `IN` clause

**Before/after diff:** The pagination query rewritten, the N+1 collapsed into a single query

**Benchmark:** Latency at row counts 1K / 10K / 100K / 1M before and after

**Code state:** Composite index, cursor pagination, no N+1 queries, slow query log enabled

---

### Article 4: Authentication and Authorization

**Constraint:** The API must serve multiple users and each user must only see and modify their own tasks.

**What breaks:** No auth means any caller can read or modify any task. Scoping every query to `user_id` touches every endpoint. Adding a middleware layer changes request handling for the entire app.

**What changes:**
- JWT-based authentication: token generation, validation middleware, 401 on missing/invalid token
- Every query scoped to the authenticated `user_id` (no global reads)
- Object-level authorization: `GET /tasks/{id}` returns 403 if the task belongs to a different user (not 404 — do not leak existence)
- Password hashing (bcrypt/argon2), no plaintext storage
- Token refresh pattern

**Before/after diff:** The middleware added, every query updated with `WHERE user_id = $1`

**Security note:** IDOR (insecure direct object reference) explained: why returning 404 instead of 403 leaks information

**Code state:** JWT auth, user-scoped queries, object-level authorization, password hashing

---

### Article 5: Observability

**Constraint:** Something is wrong in production and you cannot tell what, where, or why.

**What breaks:** Print statements and raw tracebacks are not searchable. No metrics means you learn about problems from users, not dashboards. No request tracing means you cannot find which step in a multi-layer request is slow.

**What changes:**
- Structured logging: every log line is JSON with `request_id`, `user_id`, `duration_ms`, `status_code` (structlog for Python, zerolog for Go)
- Request ID propagation: generated at the edge, threaded through every log line and downstream call
- Prometheus metrics endpoint `/metrics`: request count, latency histogram, active connections, cache hit rate
- OpenTelemetry tracing: spans for DB queries, Redis calls, and outbound HTTP — latency visible per layer
- Alerting thresholds: what to alert on vs what to log for later

**Before/after diff:** The logging middleware, the metrics instrumentation on the DB client

**Diagram:** A single request traced through structured logs, then through spans — same request, two views

**Code state:** Structured JSON logs, request ID, Prometheus metrics, OpenTelemetry tracing

---

### Article 6: Security Hardening

**Constraint:** A security audit found vulnerabilities. The API must be hardened before going public.

**What breaks:** Input fields have no length or format limits beyond type checking. CORS is wide open. Security headers are absent. The user enumeration endpoint reveals whether an email exists.

**What changes:**
- Input validation: field length limits, format constraints, rejecting oversized payloads (413)
- CORS: explicit allowed origins, no wildcard in production
- Security headers: `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`
- User enumeration: registration and password reset return identical responses for existing and non-existing emails
- Parameterized queries audit: verify no string interpolation in any SQL (already done but explicitly validated)
- Rate limiting on auth endpoints: stricter than the general API limit

**Before/after diff:** The validation tightening, the security headers middleware

**Checklist:** OWASP API Security Top 10 mapped to what is and is not addressed by this series

**Code state:** Input limits, CORS policy, security headers, no user enumeration, auth rate limiting

---

### Article 7: Sub-100ms p95 Latency

**Constraint:** p95 response time must be under 100ms at 100 RPS on all endpoints.

**What breaks:** Cache misses on hot `GET /tasks/{id}` paths hit the database on every request. JSON serialization of large result sets adds tail latency. The list endpoint returns more fields than the client needs.

**What changes:**
- Redis cache for `GET /tasks/{id}` (cache-aside, TTL aligned to expected read frequency)
- Cache invalidation on task update and delete
- Response model trimming: list endpoint returns a subset of fields; detail endpoint returns full record
- Profiling walkthrough: how to identify the slow line in a flamegraph

**Before/after diff:** The cache-aside pattern added to the GET handler

**Benchmark:** Latency histogram before and after showing p95 drop under 100ms

**Code state:** Redis cache, cache invalidation, trimmed response models, profiling middleware

---

### Article 8: Zero-Downtime Deployments

**Constraint:** Deploying a new version must not drop a single request or corrupt data.

**What breaks:** Killing the process mid-request drops in-flight work. Running migrations before the new code is deployed can break the running version. No readiness probe means traffic hits a pod before it is ready.

**What changes:**
- Graceful shutdown: wait for in-flight requests before exit (SIGTERM handler)
- Alembic/Django migration strategy: additive-only, never remove or rename a column in the same deploy as the code change
- Readiness vs liveness health checks (`/health/live`, `/health/ready`)
- The expand-contract pattern for schema changes: add column, backfill, then remove the old column in a later deploy
- Large-table migrations: how to add a column or change a type on a 50M-row table without locking (concurrent index builds, batched backfills)

**Before/after diff:** The SIGTERM handler, the migration split

**Diagram:** Deploy timeline showing old/new version overlap and migration sequencing

**Code state:** Graceful shutdown, dual health endpoints, expand-contract migration pattern

---

### Article 9: Surviving Partial Failures

**Constraint:** If PostgreSQL is slow or Redis is down, the API must degrade gracefully, not error completely.

**What breaks:** A 5-second database timeout cascades to all endpoints. Redis being down crashes the GET handler. No retry means a transient network hiccup returns 500.

**What changes:**
- Timeout on every database and cache operation
- Circuit breaker: after N failures, stop calling the dependency and return a fallback response
- Redis failure mode: if cache is unavailable, fall through to the database (not a 500)
- Retry with exponential backoff and jitter on idempotent operations
- Structured error responses (`{ "error": "...", "code": "..." }`) instead of raw 500s

**Before/after diff:** The try/except/fallback pattern, the circuit breaker state machine

**Code state:** Timeouts everywhere, circuit breaker, cache fallthrough, structured errors

---

### Article 10: 10,000 Requests per Second

**Constraint:** The API must sustain 10k RPS with p95 under 100ms and zero 5xx errors.

**What breaks:** A single process cannot saturate 10k RPS. Write-heavy paths saturate the database. Synchronous work in the POST handler (sending emails, triggering webhooks) adds latency to the request path.

**What changes:**
- Horizontal scaling: the app is now fully stateless (session in Redis, uploads in S3)
- Rate limiting: token bucket per user (Redis + Lua script), 429 with Retry-After header
- Background job queue: `POST /tasks` returns 202 Accepted, heavy processing is async (Celery/RQ/goroutine worker pool)
- Read replicas: list and detail endpoints read from replica, writes go to primary
- Load shedding: if queue depth exceeds N, return 503 immediately rather than queueing forever

**Before/after diff:** The 202 Accepted pattern, the rate limit middleware

**Architecture diagram:** Full evolved system — LB, N app instances, Redis, Postgres primary/replica, worker fleet

**Code state:** Stateless app, rate limiting, async task queue, read replica routing, load shedding

---

## 5. Article Format Template

Each article follows a consistent structure:

```
1. Constraint statement
   - What we are trying to achieve (specific, measurable)
   - Why this constraint appears in real systems

2. Breaking the current code
   - Exact failure mode (error message, metric, benchmark)
   - Root cause explanation

3. The fix
   - Theory (1-2 paragraphs, links to relevant System Design series articles)
   - Implementation (before/after diff, inline code, explanation of each change)
   - New dependencies added and why

4. Verifying the fix
   - How to reproduce the benchmark
   - What numbers we expect and what we actually got

5. What we gave up
   - Every fix has a cost: complexity, latency, storage, operational burden
   - Explicit tradeoff statement

6. State of the system (summary diagram)
   - Architecture snapshot after this article
   - What constraints remain unaddressed
```

---

## 6. Interactive Components Needed

### CodeDiff viewer
Shows before/after code side by side with highlighted changed lines. User can toggle "before" / "after" / "diff" view. Required from article 2 onwards.

### BenchmarkChart
Bar or line chart showing latency percentiles (p50, p95, p99) or throughput before and after the optimization. Pre-rendered with hardcoded values from actual benchmark runs.

### ArchitectureDiagram (evolving)
Shows the system architecture as a diagram that adds components article by article. Makes the evolution visible across the 10-article arc.

### QueryPlanViewer (new)
Renders a simplified `EXPLAIN ANALYZE` output visually — highlights sequential scans in red, index scans in green. Needed for article 3.

### RequestTracer (stretch)
Animated trace of a single request through the system, showing which layers it touches and where time is spent. Useful for the observability article.

---

## 7. Infrastructure Requirements

### New route group
`/blog/production-apis/[stack]/[slug]`

Recommended: `/blog/production-apis/fastapi/the-baseline`, `/blog/production-apis/django/...`

### New registry
Each stack gets its own `ArticleMeta[]` registry. A parent registry lists all stacks and their series landing pages.

### Series landing page
`/blog/production-apis` — shows all three stacks, their progress, and the constraint arc as a visual timeline.

Stack landing page: `/blog/production-apis/fastapi` — shows all 10 articles for the FastAPI series.

### Article loader
Same pattern as system design: `article-loader.ts` per stack with lazy imports.

### GitHub repository
Each stack's code should live in a real GitHub repo that readers can clone. Articles link to specific commits (before state) and the PR (the fix).

Repos:
- `codetail/production-apis-fastapi`
- `codetail/production-apis-django`
- `codetail/production-apis-go`

---

## 8. Content Decisions Needed Before Starting

1. **GitHub repos**: Do we create real repos and link to commits, or keep code examples self-contained in the articles? Real repos are more credible but require maintenance.

2. **Docker**: Should the baseline article include Docker/docker-compose setup? Makes the "run it yourself" story stronger but adds setup overhead to article 1.

3. **Stack order**: FastAPI then Django then Go, or FastAPI then Go then Django? Django readers are a larger audience; Go readers are more performance-focused.

4. **Naming**: "Production-Ready APIs", "Building Under Pressure", "Constraint-Driven Engineering", or something else?

5. **Depth vs breadth**: 10 articles per stack is the minimum viable arc. Could extend to 12 (add multi-tenancy, cost optimization). Decide based on articles 1-10 reception.

6. **Shared constraint articles**: Some constraints (rate limiting, graceful shutdown) are nearly identical across stacks. Write each stack independently for SEO, or write one master article and link to stack-specific diffs?

---

## 9. Success Metrics

- Reader completes all 10 articles in a stack (completion rate)
- Reader clones or forks the companion GitHub repo (engagement signal)
- Article 10 architecture matches what the reader's production system looks like (applicability)
- Series drives referrals ("I learned X from Codetail") in developer communities

---

## 10. Dependencies / Sequencing

- **Prerequisite:** System Design & Architecture series articles 8-15 must be complete first (establishes the theory that the production series references)
- **Prerequisite:** GitHub organization and repos created
- **Prerequisite:** CodeDiff interactive component built before article 2
- **Prerequisite:** QueryPlanViewer component built before article 3
- **Optional prerequisite:** BenchmarkChart component (can start with static images in articles 2-3, upgrade later)

---

## 11. Rough Timeline (after system design series is done)

| Week | Milestone |
|------|-----------|
| 1 | Infrastructure: route group, registry, series landing page |
| 2 | FastAPI article 1 (baseline) + companion repo |
| 3 | FastAPI article 2 (100 concurrent) + CodeDiff component |
| 4 | FastAPI article 3 (slow queries) + QueryPlanViewer component |
| 5 | FastAPI article 4 (auth) |
| 6 | FastAPI article 5 (observability) |
| 7 | FastAPI article 6 (security) |
| 8 | FastAPI article 7 (latency) + BenchmarkChart component |
| 9 | FastAPI article 8 (zero-downtime) |
| 10 | FastAPI article 9 (partial failures) |
| 11 | FastAPI article 10 (10k RPS) + series retrospective |
| 12+ | Replicate for Django (faster: format proven, reuse components) |
| 15+ | Replicate for Go |

---

*This document should be revisited and decisions in section 8 confirmed before implementation begins.*
