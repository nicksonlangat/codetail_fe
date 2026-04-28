const DECISION_ROWS = [
  {
    question: "Do you need ACID transactions?",
    sql: "Yes — use SQL",
    nosql: "Only if the DB supports them (MongoDB 4+, DynamoDB Transactions)",
    winner: "sql",
  },
  {
    question: "Is your schema fixed or known in advance?",
    sql: "Yes — relational model enforces it",
    nosql: "No — document stores allow schema-per-document flexibility",
    winner: "nosql",
  },
  {
    question: "Do you need complex, ad-hoc queries?",
    sql: "Yes — SQL handles arbitrary joins and aggregations",
    nosql: "Only for pre-designed access patterns",
    winner: "sql",
  },
  {
    question: "Do you need massive write throughput (>100k/s)?",
    sql: "Hard — vertical scaling has limits",
    nosql: "Yes — Cassandra, DynamoDB scale writes linearly",
    winner: "nosql",
  },
  {
    question: "Is your data highly hierarchical/nested?",
    sql: "Awkward — requires multiple tables and joins",
    nosql: "Natural fit for document stores",
    winner: "nosql",
  },
  {
    question: "Do you need full-text search?",
    sql: "Basic — use Postgres tsvector or add Elasticsearch",
    nosql: "MongoDB Atlas Search, Elasticsearch (a document store)",
    winner: "both",
  },
];

const USE_CASES = [
  { usecase: "Financial ledger", pick: "PostgreSQL", reason: "ACID is non-negotiable. Money must not be double-spent or lost." },
  { usecase: "User profiles", pick: "MongoDB", reason: "Flexible schema. Each user can have different optional fields." },
  { usecase: "Session storage", pick: "Redis", reason: "TTL-based eviction, O(1) reads. Purpose-built for ephemeral data." },
  { usecase: "Product catalog", pick: "MongoDB or DynamoDB", reason: "Variable attributes per product. High read volume." },
  { usecase: "IoT metrics", pick: "Cassandra or InfluxDB", reason: "Massive write throughput, time-ordered data, cheap storage." },
  { usecase: "Social graph", pick: "Neo4j", reason: "Friend-of-a-friend queries are traversals, not joins." },
  { usecase: "E-commerce orders", pick: "PostgreSQL", reason: "Inventory, payment, and order state all need ACID." },
  { usecase: "Real-time leaderboard", pick: "Redis (ZADD/ZRANK)", reason: "Sorted sets provide O(log n) ranked reads with atomic updates." },
  { usecase: "Content management", pick: "MongoDB or Postgres", reason: "Either works. Choose by team familiarity and query patterns." },
  { usecase: "Analytics / OLAP", pick: "BigQuery, Redshift, ClickHouse", reason: "Columnar storage with vectorized execution for aggregations." },
];

export function ChoosingSection() {
  return (
    <section>
      <h2 id="choosing-a-database" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Choosing the Right Database
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The right database is determined by your access patterns, not by what is popular
        or what your team already knows. That said, PostgreSQL is an excellent default:
        it handles most workloads well, supports JSON columns for flexibility, has excellent
        tooling, and adds ACID at no extra cost.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Reach for a NoSQL database when you have a specific reason, not out of a desire
        to use the newest technology. The wrong database for your access patterns creates
        pain that compounds over years.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Decision guide</h3>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium w-1/3">Question</th>
              <th className="text-left py-2 pr-3 text-blue-500 font-medium">SQL answer</th>
              <th className="text-left py-2 text-primary font-medium">NoSQL answer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {DECISION_ROWS.map(({ question, sql, nosql, winner }) => (
              <tr key={question} className={winner === "sql" ? "bg-blue-500/2" : winner === "nosql" ? "bg-primary/2" : ""}>
                <td className="py-2.5 pr-4 font-medium text-foreground/80 align-top">{question}</td>
                <td className={`py-2.5 pr-3 align-top ${winner === "sql" ? "text-blue-500 font-medium" : "text-muted-foreground"}`}>
                  {sql}
                </td>
                <td className={`py-2.5 align-top ${winner === "nosql" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {nosql}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Common use cases and their databases</h3>

      <div className="grid gap-2 sm:grid-cols-2">
        {USE_CASES.map(({ usecase, pick, reason }) => (
          <div key={usecase} className="p-3 rounded-xl border border-border bg-card">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-[12px] font-semibold">{usecase}</span>
              <span className="text-[9px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0">
                {pick}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">{reason}</p>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mt-6">
        <p className="text-[13px] text-foreground/70">
          Many mature systems use multiple databases: PostgreSQL for transactional data,
          Redis for caching and sessions, Elasticsearch for full-text search, and S3 for
          blob storage. This is called polyglot persistence. It adds operational complexity,
          so only add a second database when the first genuinely cannot do the job.
        </p>
      </div>
    </section>
  );
}
