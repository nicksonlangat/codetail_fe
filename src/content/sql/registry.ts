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

export const sqlArticles: ArticleMeta[] = [
  {
    slug: "select-and-where",
    title: "SELECT and WHERE",
    subtitle: "Read data. Filter data. Precisely.",
    description:
      "How the SELECT statement works, what the WHERE clause actually evaluates, and the complete set of operators for filtering: comparisons, LIKE, IN, BETWEEN, IS NULL, and boolean logic.",
    order: 1,
    estimatedMinutes: 14,
    tags: ["sql", "select", "where", "filtering", "queries"],
    relatedChallenges: [],
    icon: "🔍",
  },
  {
    slug: "joins",
    title: "JOINs",
    subtitle: "Combine rows from multiple tables.",
    description:
      "How SQL joins work from first principles: matching rows on a condition, the difference between INNER, LEFT, RIGHT, and FULL OUTER joins, and when to use each one.",
    order: 2,
    estimatedMinutes: 18,
    tags: ["sql", "joins", "inner-join", "left-join", "outer-join"],
    relatedChallenges: [],
    icon: "🔗",
  },
  {
    slug: "aggregations",
    title: "Aggregations",
    subtitle: "Summarize many rows into one.",
    description:
      "How GROUP BY works, what the aggregate functions COUNT, SUM, AVG, MIN, and MAX actually do, and the critical difference between WHERE (filters rows) and HAVING (filters groups).",
    order: 3,
    estimatedMinutes: 16,
    tags: ["sql", "aggregations", "group-by", "having", "count", "sum"],
    relatedChallenges: [],
    icon: "📊",
  },
  {
    slug: "subqueries",
    title: "Subqueries",
    subtitle: "Queries inside queries.",
    description:
      "What subqueries are, the difference between correlated and non-correlated subqueries, and when to use IN, EXISTS, and derived tables — with the performance trade-offs of each.",
    order: 4,
    estimatedMinutes: 16,
    tags: ["sql", "subqueries", "correlated", "exists", "in", "derived-tables"],
    relatedChallenges: [],
    icon: "🪆",
  },
  {
    slug: "ctes",
    title: "Common Table Expressions",
    subtitle: "Named subqueries that make complex queries readable.",
    description:
      "How the WITH clause works, why CTEs make complex queries readable, how to chain multiple CTEs, and how recursive CTEs compute tree and graph traversals.",
    order: 5,
    estimatedMinutes: 14,
    tags: ["sql", "cte", "with", "recursive", "readability"],
    relatedChallenges: [],
    icon: "📋",
  },
  {
    slug: "window-functions",
    title: "Window Functions",
    subtitle: "Aggregate without collapsing rows.",
    description:
      "How window functions compute values across a set of rows without GROUP BY collapsing them. ROW_NUMBER, RANK, LAG, LEAD, and how PARTITION BY and OVER control the window.",
    order: 6,
    estimatedMinutes: 20,
    tags: ["sql", "window-functions", "row-number", "rank", "lag", "lead", "over", "partition-by"],
    relatedChallenges: [],
    icon: "🪟",
  },
  {
    slug: "indexes",
    title: "Indexes",
    subtitle: "How the database finds rows fast.",
    description:
      "How B-tree indexes work internally, how the query planner decides to use them, composite indexes and column order, covering indexes, and reading EXPLAIN ANALYZE output.",
    order: 7,
    estimatedMinutes: 18,
    tags: ["sql", "indexes", "b-tree", "explain", "performance", "query-planning"],
    relatedChallenges: [],
    icon: "⚡",
  },
  {
    slug: "null-handling",
    title: "NULL Handling",
    subtitle: "The third truth value that breaks your queries.",
    description:
      "Why NULL is not zero or empty string, how three-valued logic changes WHERE and JOIN behavior, and the functions that make NULL predictable: IS NULL, COALESCE, and NULLIF.",
    order: 8,
    estimatedMinutes: 14,
    tags: ["sql", "null", "coalesce", "three-valued-logic", "is-null"],
    relatedChallenges: [],
    icon: "🕳️",
  },
  {
    slug: "transactions-in-sql",
    title: "Transactions in SQL",
    subtitle: "BEGIN, COMMIT, ROLLBACK.",
    description:
      "How to write explicit transactions in SQL, what SAVEPOINT gives you inside a transaction, and how isolation levels — READ COMMITTED, REPEATABLE READ, SERIALIZABLE — change what you see.",
    order: 9,
    estimatedMinutes: 16,
    tags: ["sql", "transactions", "begin", "commit", "rollback", "isolation-levels"],
    relatedChallenges: [],
    icon: "🔒",
  },
  {
    slug: "constraints",
    title: "Constraints",
    subtitle: "Rules the database enforces at the boundary.",
    description:
      "How PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, and NOT NULL constraints work, when they check, what they reject, and how deferrable constraints let you control timing within a transaction.",
    order: 10,
    estimatedMinutes: 16,
    tags: ["sql", "constraints", "primary-key", "foreign-key", "unique", "check", "not-null"],
    relatedChallenges: [],
    icon: "🛡️",
  },
  {
    slug: "schema-design",
    title: "Schema Design",
    subtitle: "Shape your data before you query it.",
    description:
      "What the normal forms actually mean, why you normalize data, when to denormalize, and the practical schema decisions — one-to-many, many-to-many, and nullable foreign keys — that affect every query you write.",
    order: 11,
    estimatedMinutes: 20,
    tags: ["sql", "schema-design", "normalization", "1nf", "2nf", "3nf", "er-modeling"],
    relatedChallenges: [],
    icon: "🗂️",
  },
  {
    slug: "query-optimization",
    title: "Query Optimization",
    subtitle: "Read the plan. Fix the scan.",
    description:
      "How to read EXPLAIN ANALYZE output, what sequential scans and index scans tell you, how the query planner estimates row counts, and the concrete changes that make slow queries fast.",
    order: 12,
    estimatedMinutes: 18,
    tags: ["sql", "query-optimization", "explain", "performance", "indexes", "query-planning"],
    relatedChallenges: [],
    icon: "🔬",
  },
];

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return sqlArticles.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string) {
  const idx = sqlArticles.findIndex((a) => a.slug === slug);
  return {
    prev: idx > 0 ? sqlArticles[idx - 1] : null,
    next: idx < sqlArticles.length - 1 ? sqlArticles[idx + 1] : null,
  };
}
