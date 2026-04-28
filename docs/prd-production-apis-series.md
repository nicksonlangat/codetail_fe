# PRD: Production-Ready APIs — Stack-Specific System Design Series

**Status:** Draft  
**Author:** Codetail  
**Created:** 2026-04-28  
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

Start with FastAPI. Validate the format with 6 articles. Then replicate the progression for Django and Go, using the FastAPI articles as the reference implementation.

Running all three stacks in parallel before the format is proven risks three underperforming series instead of one excellent one.

---

## 4. Constraint Arc (per stack)

Each stack follows this six-article progression. The baseline API is identical in spirit across stacks (same 3 endpoints, same data model) but written idiomatically for each.

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

**What breaks:** SQLite cannot handle concurrent writes. Sync endpoints block the event loop (FastAPI). Connection pool exhausted immediately (Django). No health check means load balancer doesn't know the app is up.

**What changes:**
- SQLite → PostgreSQL
- Connection pooling (asyncpg for FastAPI, psycopg2 pooling for Django, pgx for Go)
- Async endpoint rewrite (FastAPI)
- Basic `/health` endpoint
- `EXPLAIN ANALYZE` showing the missing index on tasks

**Before/after diff:** Highlighted inline diff showing exactly what changed

**Benchmark:** Simulated chart showing p50/p95/p99 latency before and after (using k6 or wrk results)

**Code state:** Postgres, connection pool, async, index on `created_at` and `user_id`, `/health`

---

### Article 3: Sub-100ms p95 Latency

**Constraint:** p95 response time must be under 100ms at 100 RPS.

**What breaks:** List endpoint does a full table scan. No caching on hot GET paths. JSON serialization of large result sets is slow.

**What changes:**
- Redis cache for `GET /tasks/{id}` (cache-aside, 60s TTL)
- Composite index on `(user_id, created_at DESC)` for list pagination
- Cursor-based pagination replacing offset (avoids full scan to skip N rows)
- Response model trimming (return only necessary fields)
- Profiling walkthrough: how to find the slow line

**Before/after diff:** The cache-aside pattern added to the GET handler, the pagination query rewritten

**Benchmark:** Latency histogram before/after showing p95 drop

**Code state:** Redis cache, cursor pagination, covering index, profiling middleware

---

### Article 4: Zero-Downtime Deployments

**Constraint:** Deploying a new version must not drop a single request or corrupt data.

**What breaks:** Killing the process mid-request drops in-flight work. Running migrations before the new code is deployed can break the old version. No readiness probe means traffic hits a pod before it is ready.

**What changes:**
- Graceful shutdown: wait for in-flight requests before exit (SIGTERM handler)
- Alembic/Django migration strategy: additive-only, never remove/rename in same deploy
- Readiness vs liveness health checks (`/health/live`, `/health/ready`)
- The expand-contract pattern for schema changes (add column → backfill → remove old column)

**Before/after diff:** The SIGTERM handler, the migration split

**Diagram:** Deploy timeline showing old/new version overlap period

**Code state:** Graceful shutdown, dual health endpoints, expand-contract migration pattern

---

### Article 5: Surviving Partial Failures

**Constraint:** If PostgreSQL is slow or Redis is down, the API must degrade gracefully, not error completely.

**What breaks:** A 5-second database timeout cascades to all endpoints. Redis being down crashes the GET handler. No retry means a transient network hiccup returns 500.

**What changes:**
- Timeout on every database and cache operation
- Circuit breaker pattern: after N failures, stop calling the dependency and return a fallback
- Redis failure mode: if cache is unavailable, fall through to the database (not a 500)
- Retry with exponential backoff and jitter on idempotent operations
- Structured error responses (`{ "error": "...", "code": "..." }`) instead of raw 500s

**Before/after diff:** The try/except/fallback pattern, the circuit breaker state machine

**Code state:** Timeouts everywhere, circuit breaker, cache fallthrough, structured errors

---

### Article 6: 10,000 Requests per Second

**Constraint:** The API must sustain 10k RPS with p95 under 100ms and zero 5xx errors.

**What breaks:** A single process cannot saturate 10k RPS. Write-heavy paths (POST /tasks) saturate the database. Synchronous background work (sending emails, webhooks) adds latency to the request path.

**What changes:**
- Horizontal scaling: the app is now stateless (session in Redis, uploads in S3)
- Rate limiting: token bucket per user (Redis + Lua script), return 429 with Retry-After header
- Background job queue: POST /tasks returns 202 Accepted, actual processing is async (Celery/RQ/goroutine worker)
- Read replicas: list endpoint reads from replica, writes go to primary
- Load shedding: if queue depth exceeds N, return 503 immediately rather than queueing forever

**Before/after diff:** The 202 Accepted pattern, the rate limit middleware

**Architecture diagram:** Evolved system (LB → N app instances → Redis → Postgres primary/replica → Worker fleet)

**Code state:** Stateless app, rate limiting, async task queue, read replica routing

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
Shows before/after code side by side with highlighted changed lines. Not just syntax highlighting: changed lines are visually marked with `+`/`-` and a color band. User can toggle "before" / "after" / "diff" view.

### BenchmarkChart
Bar or line chart showing latency percentiles (p50, p95, p99) or throughput before and after the optimization. Pre-rendered with hardcoded values from actual benchmark runs.

### ArchitectureDiagram (evolving)
Shows the system architecture as a diagram that adds components article by article. Reuses the same base diagram and adds layers: Redis appears in article 3, the worker fleet in article 6. Makes the evolution visible.

### RequestTracer (stretch)
Animated trace of a single request through the system, showing which layers it touches and where time is spent. Useful for the latency article.

---

## 7. Infrastructure Requirements

### New route group
`/blog/production-apis/[stack]/[slug]` or `/blog/[stack]/[slug]`

Recommended: `/blog/production-apis/fastapi/the-baseline`, `/blog/production-apis/django/...`

### New registry
Each stack gets its own `ArticleMeta[]` registry. A parent registry lists all stacks and their series landing pages.

### Series landing page
`/blog/production-apis` — shows all three stacks, their progress, and the constraint arc as a visual timeline.

Stack landing page: `/blog/production-apis/fastapi` — shows all articles for the FastAPI series.

### Article loader
Same pattern as system design: `article-loader.ts` per stack with lazy imports.

### GitHub repository
Each stack's code should live in a real GitHub repo that readers can clone. Articles link to specific commits (before state) and the PR (the fix). This makes the diff viewer grounded in real, runnable code.

Repos:
- `codetail/production-apis-fastapi`
- `codetail/production-apis-django`
- `codetail/production-apis-go`

---

## 8. Content Decisions Needed Before Starting

1. **GitHub repos**: Do we create real repos and link to commits, or keep code examples self-contained in the articles? Real repos are more credible but require maintenance.

2. **Docker**: Should the baseline article include Docker/docker-compose setup? Makes the "run it yourself" story stronger but adds setup overhead to article 1.

3. **Stack order**: FastAPI → Django → Go, or FastAPI → Go → Django? Django readers are a larger audience; Go readers are more performance-focused.

4. **Naming**: "Production-Ready APIs", "Building Under Pressure", "Constraint-Driven Engineering", or something else?

5. **Depth vs breadth**: 6 articles per stack is the minimum. Could extend to 8-10 (add auth, observability, multi-tenancy). Decide based on article 1-6 reception.

6. **Shared constraint articles**: Some constraints (rate limiting, graceful shutdown) are nearly identical across stacks. Do we write each stack independently (more work, more SEO) or write one "master" article and link to stack-specific diffs?

---

## 9. Success Metrics

- Reader completes all 6 articles in a stack (completion rate)
- Reader clones/forks the companion GitHub repo (engagement signal)
- Article 6 architecture matches what the reader's production system looks like (applicability)
- Series drives referrals ("I learned X from Codetail") in developer communities

---

## 10. Dependencies / Sequencing

- **Prerequisite:** System Design & Architecture series articles 8-15 must be complete first (establishes the theory that the production series references)
- **Prerequisite:** GitHub organization and repos created
- **Prerequisite:** CodeDiff interactive component built before article 2
- **Optional prerequisite:** BenchmarkChart component (can start with static images in articles 2-3, upgrade later)

---

## 11. Rough Timeline (after system design series is done)

| Week | Milestone |
|------|-----------|
| 1 | Infrastructure: route group, registry, series landing page |
| 2 | FastAPI article 1 (baseline) + companion repo |
| 3 | FastAPI article 2 (100 concurrent) + CodeDiff component |
| 4 | FastAPI article 3 (latency) + BenchmarkChart component |
| 5 | FastAPI article 4 (zero-downtime) |
| 6 | FastAPI article 5 (partial failures) |
| 7 | FastAPI article 6 (10k RPS) + series retrospective |
| 8+ | Replicate for Django (faster: format proven, reuse components) |
| 10+ | Replicate for Go |

---

*This document should be revisited and decisions in section 8 confirmed before implementation begins.*
