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
};

export const systemDesignArticles: ArticleMeta[] = [
  {
    slug: "the-request-journey",
    title: "The Request Journey",
    subtitle: "What really happens when you type a URL.",
    description:
      "Trace a single HTTP request from browser to database and back. DNS, TCP, load balancers, app servers — every hop visualized interactively with a step-by-step flow diagram.",
    order: 1,
    estimatedMinutes: 25,
    tags: ["http", "dns", "tcp", "networking", "load-balancer", "request-response"],
    relatedChallenges: [],
    icon: "🌐",
  },
  {
    slug: "scalability-fundamentals",
    title: "Scalability Fundamentals",
    subtitle: "Vertical vs horizontal. When systems buckle and how to fix them.",
    description:
      "Why servers fall over, what scaling really means, and the trade-offs between bigger hardware vs more servers. Interactive traffic simulator shows queueing theory in action.",
    order: 2,
    estimatedMinutes: 22,
    tags: ["scalability", "horizontal-scaling", "vertical-scaling", "load-balancing", "capacity"],
    relatedChallenges: [],
    icon: "📈",
  },
  {
    slug: "load-balancing",
    title: "Load Balancing",
    subtitle: "Routing traffic intelligently across servers.",
    description:
      "Layer 4 vs Layer 7, algorithms (round-robin, least-connections, IP-hash), health checks, and sticky sessions. Interactive algorithm explorer.",
    order: 3,
    estimatedMinutes: 18,
    tags: ["load-balancer", "round-robin", "nginx", "algorithms", "reverse-proxy"],
    relatedChallenges: [],
    icon: "⚖️",
  },
  {
    slug: "caching",
    title: "Caching",
    subtitle: "The fastest request is one you never make.",
    description:
      "Cache layers from CPU to CDN. Eviction policies (LRU, LFU), cache invalidation (the hard problem), write strategies, and TTL design. Interactive cache simulator.",
    order: 4,
    estimatedMinutes: 24,
    tags: ["cache", "redis", "lru", "cdn", "cache-invalidation", "memcached", "ttl"],
    relatedChallenges: [],
    icon: "⚡",
  },
  {
    slug: "databases-sql-vs-nosql",
    title: "Databases: SQL vs NoSQL",
    subtitle: "Not just syntax — a fundamental design choice.",
    description:
      "Relational vs document vs key-value vs columnar. When ACID matters, when it doesn't, and how to choose the right database for your access patterns.",
    order: 5,
    estimatedMinutes: 26,
    tags: ["sql", "nosql", "acid", "mongodb", "postgresql", "cassandra", "dynamodb"],
    relatedChallenges: [],
    icon: "🗄️",
  },
  {
    slug: "indexes-and-query-optimization",
    title: "Indexes & Query Optimization",
    subtitle: "O(n) full scans vs O(log n) index lookups.",
    description:
      "How B-tree indexes work, composite index design, when indexes hurt writes, EXPLAIN plans, and the N+1 query problem. Visual B-tree explorer.",
    order: 6,
    estimatedMinutes: 20,
    tags: ["indexes", "b-tree", "query-optimization", "sql", "explain", "n+1"],
    relatedChallenges: [],
    icon: "🔍",
  },
  {
    slug: "cap-theorem",
    title: "CAP Theorem",
    subtitle: "Consistency, Availability, Partition Tolerance: pick two.",
    description:
      "What CAP actually means in practice, why partition tolerance is non-negotiable in distributed systems, and how real databases navigate the CP/AP trade-off.",
    order: 7,
    estimatedMinutes: 18,
    tags: ["cap-theorem", "consistency", "availability", "distributed-systems", "eventual-consistency"],
    relatedChallenges: [],
    icon: "🔺",
  },
  {
    slug: "apis-rest-graphql-grpc",
    title: "APIs: REST, GraphQL, gRPC",
    subtitle: "Three paradigms, three different trade-offs.",
    description:
      "When to use REST, GraphQL, or gRPC. Over-fetching, under-fetching, schema design, versioning, and the performance characteristics of each.",
    order: 8,
    estimatedMinutes: 22,
    tags: ["rest", "graphql", "grpc", "api-design", "http2", "protobuf"],
    relatedChallenges: [],
    icon: "🔌",
  },
  {
    slug: "message-queues-and-event-streams",
    title: "Message Queues & Event Streams",
    subtitle: "Decouple producers and consumers. Handle backpressure.",
    description:
      "Why async beats sync for non-critical paths. Queues (RabbitMQ, SQS), streams (Kafka), delivery guarantees, and fan-out patterns. Interactive queue visualizer.",
    order: 9,
    estimatedMinutes: 24,
    tags: ["kafka", "rabbitmq", "sqs", "pub-sub", "event-driven", "backpressure"],
    relatedChallenges: [],
    icon: "📨",
  },
  {
    slug: "microservices-vs-monolith",
    title: "Microservices vs Monolith",
    subtitle: "The honest trade-off guide.",
    description:
      "When a monolith is the right answer, when to break it apart, service boundaries, the distributed systems tax, and what 'done badly' looks like for each.",
    order: 10,
    estimatedMinutes: 20,
    tags: ["microservices", "monolith", "service-mesh", "decomposition", "ddd"],
    relatedChallenges: [],
    icon: "🏗️",
  },
  {
    slug: "rate-limiting",
    title: "Rate Limiting",
    subtitle: "Token bucket, leaky bucket, and sliding windows.",
    description:
      "Protect services from abuse and overload. Token bucket vs leaky bucket algorithms, distributed rate limiting with Redis, and where to put limiters.",
    order: 11,
    estimatedMinutes: 16,
    tags: ["rate-limiting", "token-bucket", "leaky-bucket", "redis", "throttling"],
    relatedChallenges: [],
    icon: "🚦",
  },
  {
    slug: "authentication-and-authorization",
    title: "Authentication & Authorization",
    subtitle: "Who are you? What are you allowed to do?",
    description:
      "Sessions vs JWTs, OAuth 2.0 flows, API keys, RBAC vs ABAC, and the security trade-offs of each approach. Interactive OAuth flow diagram.",
    order: 12,
    estimatedMinutes: 22,
    tags: ["jwt", "oauth", "sessions", "rbac", "api-keys", "authentication"],
    relatedChallenges: [],
    icon: "🔐",
  },
  {
    slug: "cdns-and-edge-networks",
    title: "CDNs & Edge Networks",
    subtitle: "Serve content from 50ms away instead of 200ms.",
    description:
      "How CDNs work, PoP placement, cache hierarchies, origin shield, purging strategies, and edge computing for dynamic content.",
    order: 13,
    estimatedMinutes: 16,
    tags: ["cdn", "edge", "cloudflare", "pop", "cache-control", "origin-shield"],
    relatedChallenges: [],
    icon: "🌍",
  },
  {
    slug: "resilience-patterns",
    title: "Resilience Patterns",
    subtitle: "Design for failure. Build systems that bend, not break.",
    description:
      "Circuit breaker, retry with exponential backoff, bulkhead, timeout, and fallback patterns. Interactive failure injection simulator.",
    order: 14,
    estimatedMinutes: 20,
    tags: ["circuit-breaker", "retry", "bulkhead", "timeout", "resilience"],
    relatedChallenges: [],
    icon: "🛡️",
  },
  {
    slug: "design-a-real-system",
    title: "Design a Real System",
    subtitle: "Put it all together: design a URL shortener end-to-end.",
    description:
      "Walk through a complete system design: requirements, capacity estimation, API design, database schema, caching strategy, and scaling plan. Annotated architecture diagram.",
    order: 15,
    estimatedMinutes: 35,
    tags: ["system-design", "url-shortener", "case-study", "capacity-planning", "api-design"],
    relatedChallenges: [],
    icon: "🏛️",
  },
];

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return systemDesignArticles.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string) {
  const idx = systemDesignArticles.findIndex((a) => a.slug === slug);
  return {
    prev: idx > 0 ? systemDesignArticles[idx - 1] : null,
    next: idx < systemDesignArticles.length - 1 ? systemDesignArticles[idx + 1] : null,
  };
}
