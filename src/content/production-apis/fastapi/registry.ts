export type ArticleMeta = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  tags: string[];
  relatedChallenges: string[];
  icon: string;
  constraint: string;
};

export const fastapiArticles: ArticleMeta[] = [
  {
    slug: "the-baseline",
    title: "The Baseline",
    subtitle: "Build it naive. Ship it. Understand exactly what will break.",
    description:
      "Start with the simplest possible FastAPI task management API: SQLite, synchronous handlers, no error handling. This is the 'it works on my laptop' state every production system begins from.",
    order: 1,
    estimatedMinutes: 20,
    tags: ["fastapi", "python", "sqlite", "api-design", "pydantic"],
    relatedChallenges: [],
    icon: "🔧",
    constraint: "None — ship it",
  },
  {
    slug: "100-concurrent-users",
    title: "100 Concurrent Users",
    subtitle: "SQLite breaks. The event loop blocks. The pool exhausts.",
    description:
      "Apply the first real constraint: 100 concurrent requests without errors. Migrate to PostgreSQL, add connection pooling, rewrite handlers as async, add a health endpoint.",
    order: 2,
    estimatedMinutes: 25,
    tags: ["postgresql", "asyncpg", "connection-pooling", "async", "health-check"],
    relatedChallenges: [],
    icon: "👥",
    constraint: "100 concurrent requests, zero errors",
  },
  {
    slug: "slow-queries",
    title: "Slow Queries",
    subtitle: "The table grows. The list endpoint times out. EXPLAIN shows a full scan.",
    description:
      "Diagnose and fix slow database queries using the slow query log, EXPLAIN ANALYZE, and strategic indexing. Eliminate the N+1 pattern and replace offset pagination with cursor-based pagination.",
    order: 3,
    estimatedMinutes: 28,
    tags: ["postgresql", "indexes", "explain-analyze", "n+1", "cursor-pagination", "query-optimization"],
    relatedChallenges: [],
    icon: "🐢",
    constraint: "p95 < 500ms at any table size",
  },
  {
    slug: "authentication-and-authorization",
    title: "Authentication & Authorization",
    subtitle: "User two can read user one's tasks. That is a security incident.",
    description:
      "Add JWT authentication, scope every database query to the authenticated user, and implement object-level authorization. Understand IDOR and why 403 is not the same as 404.",
    order: 4,
    estimatedMinutes: 30,
    tags: ["jwt", "authentication", "authorization", "idor", "bcrypt", "middleware"],
    relatedChallenges: [],
    icon: "🔐",
    constraint: "Each user sees only their own data",
  },
  {
    slug: "observability",
    title: "Observability",
    subtitle: "Something is wrong in production. You have no idea what.",
    description:
      "Add structured JSON logging with request IDs, a Prometheus metrics endpoint, and OpenTelemetry tracing. Make every failure diagnosable within five minutes of it happening.",
    order: 5,
    estimatedMinutes: 28,
    tags: ["observability", "structlog", "prometheus", "opentelemetry", "tracing", "logging"],
    relatedChallenges: [],
    icon: "🔭",
    constraint: "Any failure diagnosable in under 5 minutes",
  },
  {
    slug: "security-hardening",
    title: "Security Hardening",
    subtitle: "A security audit found three vulnerabilities. Fix them before launch.",
    description:
      "Harden the API against OWASP API Top 10 issues: input length limits, CORS policy, security headers, user enumeration prevention, and stricter rate limiting on auth endpoints.",
    order: 6,
    estimatedMinutes: 22,
    tags: ["security", "owasp", "cors", "input-validation", "rate-limiting", "security-headers"],
    relatedChallenges: [],
    icon: "🛡️",
    constraint: "Pass an OWASP API Top 10 audit",
  },
  {
    slug: "sub-100ms-latency",
    title: "Sub-100ms Latency",
    subtitle: "The GET endpoint hits the database on every request. Add a cache layer.",
    description:
      "Drive p95 latency under 100ms at 100 RPS. Add Redis cache-aside on the detail endpoint, invalidate on update and delete, trim response models, and learn to read a flamegraph.",
    order: 7,
    estimatedMinutes: 25,
    tags: ["redis", "caching", "cache-aside", "latency", "performance", "profiling"],
    relatedChallenges: [],
    icon: "⚡",
    constraint: "p95 < 100ms at 100 RPS",
  },
  {
    slug: "zero-downtime-deployments",
    title: "Zero-Downtime Deployments",
    subtitle: "Killing the process mid-request drops work. Migrations can break running code.",
    description:
      "Deploy new versions without dropping a single request: SIGTERM graceful shutdown, additive-only migrations, readiness vs liveness health checks, and the expand-contract pattern for large tables.",
    order: 8,
    estimatedMinutes: 26,
    tags: ["deployments", "graceful-shutdown", "migrations", "alembic", "health-checks", "expand-contract"],
    relatedChallenges: [],
    icon: "🚢",
    constraint: "Zero dropped requests on deploy",
  },
  {
    slug: "surviving-partial-failures",
    title: "Surviving Partial Failures",
    subtitle: "Redis is down. The circuit breaker opens. The API keeps serving.",
    description:
      "Make the API resilient to dependency failures: timeouts on every external call, circuit breaker on Redis with database fallback, retry with exponential backoff, and structured error responses.",
    order: 9,
    estimatedMinutes: 26,
    tags: ["resilience", "circuit-breaker", "timeouts", "retry", "backoff", "fallback"],
    relatedChallenges: [],
    icon: "🧯",
    constraint: "Degrade gracefully when dependencies fail",
  },
  {
    slug: "10000-requests-per-second",
    title: "10,000 Requests per Second",
    subtitle: "One process is not enough. The write path saturates the database.",
    description:
      "Scale to 10k RPS: make the app stateless, add per-user rate limiting, move slow work to a background job queue, route reads to a replica, and implement load shedding.",
    order: 10,
    estimatedMinutes: 35,
    tags: ["scaling", "rate-limiting", "celery", "read-replicas", "stateless", "load-shedding"],
    relatedChallenges: [],
    icon: "🚀",
    constraint: "10k RPS, p95 < 100ms, zero 5xx",
  },
];

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return fastapiArticles.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string) {
  const idx = fastapiArticles.findIndex((a) => a.slug === slug);
  return {
    prev: idx > 0 ? fastapiArticles[idx - 1] : null,
    next: idx < fastapiArticles.length - 1 ? fastapiArticles[idx + 1] : null,
  };
}
