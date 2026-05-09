import type { Node, Edge } from "@xyflow/react";

const TEAL = "#1fad87";
const EDGE = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
  type: "straight",
  markerEnd: { type: "arrowclosed" as const, color: TEAL },
  style: { stroke: TEAL, strokeWidth: 1.5 },
});

// ─── 1. The Request Journey ───────────────────────────────────────────────────

const requestJourneyNodes: Node[] = [
  { id: "rj-client",  type: "client",      position: { x: 40,  y: 180 }, data: { label: "Browser", subtitle: "User types a URL" } },
  { id: "rj-lb",      type: "loadbalancer",position: { x: 260, y: 180 }, data: { label: "Load Balancer", subtitle: "Nginx / ALB" } },
  { id: "rj-server",  type: "server",      position: { x: 490, y: 180 }, data: { label: "App Server", subtitle: "FastAPI / Node" } },
  { id: "rj-cache",   type: "cache",       position: { x: 720, y: 60  }, data: { label: "Cache", subtitle: "Redis — cache hit?" } },
  { id: "rj-db",      type: "database",    position: { x: 720, y: 300 }, data: { label: "Database", subtitle: "PostgreSQL" } },
];
const requestJourneyEdges: Edge[] = [
  EDGE("rj-e1", "rj-client", "rj-lb"),
  EDGE("rj-e2", "rj-lb",     "rj-server"),
  EDGE("rj-e3", "rj-server", "rj-cache"),
  EDGE("rj-e4", "rj-server", "rj-db"),
];
const requestJourneyNotes = `The Request Journey

Every HTTP request follows this path:

1. Browser → Load Balancer
   TLS termination, routing, rate limiting happen here.

2. Load Balancer → App Server
   One of N identical instances handles the request.

3. App Server → Cache (first)
   If a cache hit: return immediately (~1ms).
   If a miss: fall through to the database.

4. App Server → Database (on cache miss)
   Read from the replica for reads, primary for writes.

Goal: serve as many requests as possible from cache.
A 90% cache hit rate means 10× less DB load.`;

// ─── 2. Horizontal Scaling ────────────────────────────────────────────────────
// 3 app server instances, Redis Primary + Replica (shared session/cache cluster),
// DB Primary (writes) + DB Replica (reads). All servers stateless.

const horizontalNodes: Node[] = [
  { id: "hs-client",       type: "client",      position: { x: 30,  y: 300 }, data: { label: "Clients", subtitle: "10k RPS" } },
  { id: "hs-lb",           type: "loadbalancer",position: { x: 230, y: 300 }, data: { label: "Load Balancer", subtitle: "Round-robin" } },
  { id: "hs-s1",           type: "server",      position: { x: 460, y: 100 }, data: { label: "App Server 1", subtitle: "Stateless · 2 CPU" } },
  { id: "hs-s2",           type: "server",      position: { x: 460, y: 260 }, data: { label: "App Server 2", subtitle: "Stateless · 2 CPU" } },
  { id: "hs-s3",           type: "server",      position: { x: 460, y: 420 }, data: { label: "App Server 3", subtitle: "Stateless · 2 CPU" } },
  { id: "hs-redis",        type: "cache",       position: { x: 720, y: 60  }, data: { label: "Redis Primary", subtitle: "Sessions + cache" } },
  { id: "hs-redis-rep",    type: "cache",       position: { x: 720, y: 200 }, data: { label: "Redis Replica", subtitle: "Async replication" } },
  { id: "hs-db",           type: "database",    position: { x: 720, y: 360 }, data: { label: "DB Primary", subtitle: "Writes only" } },
  { id: "hs-db-rep",       type: "database",    position: { x: 720, y: 500 }, data: { label: "DB Replica", subtitle: "Reads only" } },
];
const horizontalEdges: Edge[] = [
  EDGE("hs-e1",  "hs-client",    "hs-lb"),
  EDGE("hs-e2",  "hs-lb",        "hs-s1"),
  EDGE("hs-e3",  "hs-lb",        "hs-s2"),
  EDGE("hs-e4",  "hs-lb",        "hs-s3"),
  // All servers write to Redis Primary (shared sessions)
  EDGE("hs-e5",  "hs-s1",        "hs-redis"),
  EDGE("hs-e6",  "hs-s2",        "hs-redis"),
  EDGE("hs-e7",  "hs-s3",        "hs-redis"),
  // Redis replication
  EDGE("hs-e8",  "hs-redis",     "hs-redis-rep"),
  // Writes → DB Primary
  EDGE("hs-e9",  "hs-s1",        "hs-db"),
  EDGE("hs-e10", "hs-s2",        "hs-db"),
  // Reads → DB Replica
  EDGE("hs-e11", "hs-s3",        "hs-db-rep"),
  // DB replication
  EDGE("hs-e12", "hs-db",        "hs-db-rep"),
];
const horizontalNotes = `Horizontal Scaling

Add more identical servers. Traffic is split across them
by the load balancer.

Why servers must be stateless:
  If Server 1 stored your session in memory, the next
  request (routed to Server 2) would lose it.
  Solution: sessions live in Redis, not on the server.
  Any server can handle any request.

Redis cluster (Primary + Replica):
  Primary accepts all writes (session writes, cache sets).
  Replica handles reads and provides failover.
  Without a shared Redis, you'd need sticky sessions —
  which defeats the point of horizontal scaling.

Database:
  Primary handles all writes (single source of truth).
  Replica handles reads — reduces write load on primary.
  Lag is typically 50–200ms; acceptable for most reads.

Cost vs vertical:
  Scales linearly. Add a server, add capacity.
  Bottleneck eventually shifts to the database.

Best for: stateless APIs, spiky/unpredictable traffic,
high availability requirements.`;

// ─── 3. Vertical Scaling ─────────────────────────────────────────────────────
// One beefy server handling everything. No load balancer needed.
// Show the full before/after picture with a comparison row.

const verticalNodes: Node[] = [
  // Before row
  { id: "vs-client",     type: "client",   position: { x: 50,  y: 80  }, data: { label: "Clients" } },
  { id: "vs-server-sm",  type: "server",   position: { x: 280, y: 80  }, data: { label: "App Server", subtitle: "2 CPU / 4 GB RAM" } },
  { id: "vs-db-sm",      type: "database", position: { x: 530, y: 80  }, data: { label: "Database", subtitle: "PostgreSQL" } },
  // After row (scaled up)
  { id: "vs-client2",    type: "client",   position: { x: 50,  y: 300 }, data: { label: "Clients" } },
  { id: "vs-server-lg",  type: "server",   position: { x: 280, y: 300 }, data: { label: "App Server", subtitle: "32 CPU / 128 GB RAM" } },
  { id: "vs-db-primary", type: "database", position: { x: 530, y: 220 }, data: { label: "DB Primary", subtitle: "Writes" } },
  { id: "vs-db-replica", type: "database", position: { x: 530, y: 380 }, data: { label: "DB Replica", subtitle: "Reads" } },
  // Notes
  { id: "vs-note-before",type: "text",     position: { x: 50,  y: 30  }, data: { text: "BEFORE: small box" } },
  { id: "vs-note-after", type: "text",     position: { x: 50,  y: 250 }, data: { text: "AFTER: bigger box" } },
  { id: "vs-note-limits",type: "text",     position: { x: 800, y: 180 }, data: { text: "Ceiling: ~192 vCPU\nSPOF — if it dies, everything dies\nResize requires downtime\nCheaper at low scale" } },
];
const verticalEdges: Edge[] = [
  EDGE("vs-e1", "vs-client",     "vs-server-sm"),
  EDGE("vs-e2", "vs-server-sm",  "vs-db-sm"),
  EDGE("vs-e3", "vs-client2",    "vs-server-lg"),
  EDGE("vs-e4", "vs-server-lg",  "vs-db-primary"),
  EDGE("vs-e5", "vs-server-lg",  "vs-db-replica"),
  EDGE("vs-e6", "vs-db-primary", "vs-db-replica"),
];
const verticalNotes = `Vertical Scaling

Make the one machine bigger: more CPU, more RAM, faster disk.

How it works:
  You have one server handling everything.
  When it gets slow, stop it, resize it, restart.
  No code changes. No architecture changes.
  Just a bigger box.

Why it's appealing early on:
  • No load balancer
  • No distributed state (sessions live on-box or in DB)
  • One deploy target, simple ops
  • Works well for databases (harder to shard horizontally)

The limits:
  • Hard ceiling — largest cloud instance is ~192 vCPU
  • Single point of failure — one crash = full outage
  • Resize requires downtime (stop → resize → start)
  • Cost grows super-linearly at high tiers
  • You can only go so far before you must go horizontal

When to use it:
  Early stage. Low traffic. Database servers.
  (Databases are often scaled vertically even in large
  systems because horizontal sharding is very complex.)

Compare to horizontal:
  Vertical is simpler but has a ceiling.
  Horizontal scales further but requires stateless design.
  Most production systems do both.`;

// ─── 4. Production FastAPI Stack (10k RPS) ────────────────────────────────────
// 5 distinct layers: Edge → App → Cache cluster → DB cluster → Worker fleet

const fastapiNodes: Node[] = [
  { id: "fa-client",        type: "client",      position: { x: 30,  y: 380 }, data: { label: "Clients", subtitle: "10k RPS" } },
  // Layer 1: Edge
  { id: "fa-lb",            type: "loadbalancer",position: { x: 220, y: 380 }, data: { label: "Nginx / ALB", subtitle: "TLS + rate limit" } },
  // Layer 2: App servers
  { id: "fa-s1",            type: "server",      position: { x: 450, y: 100 }, data: { label: "FastAPI ×1", subtitle: "4 Uvicorn workers" } },
  { id: "fa-s2",            type: "server",      position: { x: 450, y: 240 }, data: { label: "FastAPI ×2", subtitle: "4 Uvicorn workers" } },
  { id: "fa-s3",            type: "server",      position: { x: 450, y: 380 }, data: { label: "FastAPI ×3", subtitle: "4 Uvicorn workers" } },
  { id: "fa-s4",            type: "server",      position: { x: 450, y: 520 }, data: { label: "FastAPI ×4", subtitle: "4 Uvicorn workers" } },
  // Layer 3: Cache cluster
  { id: "fa-redis",         type: "cache",       position: { x: 700, y: 60  }, data: { label: "Redis Primary", subtitle: "Cache + rate limits + queue" } },
  { id: "fa-redis-rep",     type: "cache",       position: { x: 700, y: 200 }, data: { label: "Redis Replica", subtitle: "Read cache (async)" } },
  // Layer 4: Database cluster
  { id: "fa-primary",       type: "database",    position: { x: 700, y: 360 }, data: { label: "DB Primary", subtitle: "Writes only" } },
  { id: "fa-replica",       type: "database",    position: { x: 700, y: 500 }, data: { label: "DB Replica", subtitle: "Reads only" } },
  // Layer 5: Async worker fleet
  { id: "fa-queue",         type: "queue",       position: { x: 700, y: 640 }, data: { label: "Celery Queue", subtitle: "Redis broker" } },
  { id: "fa-w1",            type: "server",      position: { x: 960, y: 580 }, data: { label: "Worker ×1", subtitle: "acks_late=True" } },
  { id: "fa-w2",            type: "server",      position: { x: 960, y: 700 }, data: { label: "Worker ×2", subtitle: "acks_late=True" } },
];
const fastapiEdges: Edge[] = [
  EDGE("fa-e1",  "fa-client",    "fa-lb"),
  // LB → all app servers
  EDGE("fa-e2",  "fa-lb",        "fa-s1"),
  EDGE("fa-e3",  "fa-lb",        "fa-s2"),
  EDGE("fa-e4",  "fa-lb",        "fa-s3"),
  EDGE("fa-e5",  "fa-lb",        "fa-s4"),
  // App servers → Redis Primary (writes, session sets)
  EDGE("fa-e6",  "fa-s1",        "fa-redis"),
  EDGE("fa-e7",  "fa-s2",        "fa-redis"),
  // App servers → Redis Replica (reads, cache hits)
  EDGE("fa-e8",  "fa-s3",        "fa-redis-rep"),
  EDGE("fa-e9",  "fa-s4",        "fa-redis-rep"),
  // Redis replication
  EDGE("fa-e10", "fa-redis",     "fa-redis-rep"),
  // App servers → DB Primary (writes)
  EDGE("fa-e11", "fa-s1",        "fa-primary"),
  EDGE("fa-e12", "fa-s2",        "fa-primary"),
  // App servers → DB Replica (reads)
  EDGE("fa-e13", "fa-s3",        "fa-replica"),
  EDGE("fa-e14", "fa-s4",        "fa-replica"),
  // DB replication
  EDGE("fa-e15", "fa-primary",   "fa-replica"),
  // App servers enqueue async jobs
  EDGE("fa-e16", "fa-s3",        "fa-queue"),
  EDGE("fa-e17", "fa-s4",        "fa-queue"),
  // Queue → workers
  EDGE("fa-e18", "fa-queue",     "fa-w1"),
  EDGE("fa-e19", "fa-queue",     "fa-w2"),
  // Workers write results back to DB
  EDGE("fa-e20", "fa-w1",        "fa-primary"),
  EDGE("fa-e21", "fa-w2",        "fa-primary"),
];
const fastapiNotes = `Production FastAPI — 10,000 RPS

Five distinct layers. Each was added to solve one constraint.

Layer 1 — Edge (Nginx / ALB)
  TLS termination. Per-user token-bucket rate limiter
  backed by a Redis Lua script. Drops bad traffic before
  it reaches Python.

Layer 2 — Application (4 instances × 4 workers)
  Stateless FastAPI + Uvicorn. Any instance handles any
  request. Scale by adding instances.

Layer 3 — Cache cluster (Redis Primary + Replica)
  Primary: cache writes, rate limit counters, queue broker.
  Replica: cache reads (~94% of GET /tasks served here).
  Replication is async — replica lag is acceptable for reads.

Layer 4 — Database cluster (Primary + Replica)
  Primary: all writes (single source of truth).
  Replica: all reads — reduces primary write load.
  Lag: 50–200ms, acceptable for most read endpoints.

Layer 5 — Worker fleet (Celery ×2)
  POST /tasks returns 202 Accepted immediately.
  Workers consume from the queue and do the heavy work:
  webhooks, emails, notifications, report generation.
  acks_late=True: job only removed from queue after worker
  confirms success. Prevents work loss on crash.
  Workers write final results back to DB Primary.`;

// ─── 5. Microservices with Event Bus ─────────────────────────────────────────

const microservicesNodes: Node[] = [
  { id: "ms-gw",    type: "loadbalancer",position: { x: 30,  y: 300 }, data: { label: "API Gateway", subtitle: "Auth + routing" } },
  { id: "ms-users", type: "server",      position: { x: 250, y: 100 }, data: { label: "User Service", subtitle: "Auth, profiles" } },
  { id: "ms-orders",type: "server",      position: { x: 250, y: 300 }, data: { label: "Order Service", subtitle: "Cart, checkout" } },
  { id: "ms-pay",   type: "server",      position: { x: 250, y: 500 }, data: { label: "Payment Svc", subtitle: "Billing, invoices" } },
  { id: "ms-udb",   type: "database",    position: { x: 480, y: 100 }, data: { label: "Users DB", subtitle: "PostgreSQL" } },
  { id: "ms-odb",   type: "database",    position: { x: 480, y: 300 }, data: { label: "Orders DB", subtitle: "PostgreSQL" } },
  { id: "ms-pdb",   type: "database",    position: { x: 480, y: 500 }, data: { label: "Payments DB", subtitle: "PostgreSQL" } },
  { id: "ms-bus",   type: "queue",       position: { x: 720, y: 300 }, data: { label: "Event Bus", subtitle: "Kafka / RabbitMQ" } },
  { id: "ms-notif", type: "server",      position: { x: 950, y: 180 }, data: { label: "Notif Worker", subtitle: "Email, push" } },
  { id: "ms-anal",  type: "server",      position: { x: 950, y: 420 }, data: { label: "Analytics", subtitle: "Event stream" } },
];
const microservicesEdges: Edge[] = [
  EDGE("ms-e1",  "ms-gw",     "ms-users"),
  EDGE("ms-e2",  "ms-gw",     "ms-orders"),
  EDGE("ms-e3",  "ms-gw",     "ms-pay"),
  EDGE("ms-e4",  "ms-users",  "ms-udb"),
  EDGE("ms-e5",  "ms-orders", "ms-odb"),
  EDGE("ms-e6",  "ms-pay",    "ms-pdb"),
  EDGE("ms-e7",  "ms-orders", "ms-bus"),
  EDGE("ms-e8",  "ms-pay",    "ms-bus"),
  EDGE("ms-e9",  "ms-bus",    "ms-notif"),
  EDGE("ms-e10", "ms-bus",    "ms-anal"),
];
const microservicesNotes = `Microservices with Event Bus

Each service owns its data. No shared database.

Key rules:
  • Services never query each other's DB directly
  • Cross-service calls go through the API Gateway
    or are triggered by events on the bus
  • Each service can be deployed independently

Event Bus (Kafka / RabbitMQ):
  Services publish events ("order.created",
  "payment.completed"). Other services subscribe.
  Decouples producers from consumers.

Trade-offs vs. a monolith:
  ✓ Independent deployments
  ✓ One service failing doesn't cascade
  ✓ Teams can work in parallel
  ✗ Distributed tracing required
  ✗ Eventual consistency (not transactions)
  ✗ Much harder to run locally`;

// ─── Export ───────────────────────────────────────────────────────────────────

const now = new Date().toISOString();

export const DEFAULT_CANVASES = [
  {
    id: "seed-request-journey",
    title: "The Request Journey",
    nodes: requestJourneyNodes,
    edges: requestJourneyEdges,
    notes: requestJourneyNotes,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "seed-horizontal-scaling",
    title: "Horizontal Scaling",
    nodes: horizontalNodes,
    edges: horizontalEdges,
    notes: horizontalNotes,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "seed-vertical-scaling",
    title: "Vertical Scaling",
    nodes: verticalNodes,
    edges: verticalEdges,
    notes: verticalNotes,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "seed-fastapi-10k",
    title: "Production FastAPI — 10k RPS",
    nodes: fastapiNodes,
    edges: fastapiEdges,
    notes: fastapiNotes,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "seed-microservices",
    title: "Microservices + Event Bus",
    nodes: microservicesNodes,
    edges: microservicesEdges,
    notes: microservicesNotes,
    createdAt: now,
    updatedAt: now,
  },
];
