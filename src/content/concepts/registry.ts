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

export const conceptsArticles: ArticleMeta[] = [
  {
    slug: "idempotency",
    title: "Idempotency",
    subtitle: "Same request, same result. Every time.",
    description:
      "Why idempotency matters in distributed systems, how HTTP methods compare, and practical patterns for implementing it: idempotency keys, database UPSERT, and Redis deduplication.",
    order: 1,
    estimatedMinutes: 18,
    tags: ["idempotency", "distributed-systems", "http", "retry", "api-design"],
    relatedChallenges: [],
    icon: "🔁",
  },
  {
    slug: "race-conditions",
    title: "Race Conditions",
    subtitle: "When two operations collide.",
    description:
      "How concurrent operations corrupt data, why race conditions only appear under load, and the three strategies for eliminating them: pessimistic locking, optimistic locking, and atomic operations.",
    order: 2,
    estimatedMinutes: 20,
    tags: ["race-conditions", "concurrency", "database", "locking", "transactions"],
    relatedChallenges: [],
    icon: "⚡",
  },
  {
    slug: "n-plus-one-queries",
    title: "The N+1 Query Problem",
    subtitle: "One query becomes fifty. Here is why.",
    description:
      "Why ORMs silently fire one database query per row, how to detect it with query counting in tests, and the two solutions that eliminate it: JOIN-based eager loading and prefetch with a batched IN query.",
    order: 3,
    estimatedMinutes: 16,
    tags: ["n+1", "orm", "sql", "performance", "eager-loading", "database"],
    relatedChallenges: [],
    icon: "🔁",
  },
  {
    slug: "eventual-consistency",
    title: "Eventual Consistency",
    subtitle: "Replicas catch up. Eventually.",
    description:
      "What eventual consistency means in distributed systems, why replication lag causes read anomalies, and how to design read-your-writes, monotonic reads, and conflict resolution into your application.",
    order: 4,
    estimatedMinutes: 22,
    tags: ["eventual-consistency", "distributed-systems", "replication", "consistency", "cap-theorem"],
    relatedChallenges: [],
    icon: "🌐",
  },
  {
    slug: "pagination-at-scale",
    title: "Pagination at Scale",
    subtitle: "Why OFFSET breaks and what to use instead.",
    description:
      "How OFFSET pagination degrades linearly with page depth, why it causes duplicate and missing results in live data, and how cursor-based keyset pagination solves both problems with O(1) cost.",
    order: 5,
    estimatedMinutes: 18,
    tags: ["pagination", "cursor", "keyset", "offset", "sql", "api-design"],
    relatedChallenges: [],
    icon: "📄",
  },
  {
    slug: "acid-transactions",
    title: "ACID Transactions",
    subtitle: "What each letter actually protects.",
    description:
      "A precise breakdown of what Atomicity, Consistency, Isolation, and Durability guarantee — and what they do not. Includes what transactions cannot protect against and how to use them correctly in production.",
    order: 6,
    estimatedMinutes: 20,
    tags: ["acid", "transactions", "database", "consistency", "isolation-levels"],
    relatedChallenges: [],
    icon: "🔐",
  },
];

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return conceptsArticles.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string) {
  const idx = conceptsArticles.findIndex((a) => a.slug === slug);
  return {
    prev: idx > 0 ? conceptsArticles[idx - 1] : null,
    next: idx < conceptsArticles.length - 1 ? conceptsArticles[idx + 1] : null,
  };
}
