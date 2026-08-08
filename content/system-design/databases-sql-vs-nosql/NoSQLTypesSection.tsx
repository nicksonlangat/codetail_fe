import { DataModelExplorer } from "@/components/blog/interactive/data-model-explorer";

const NOSQL_TYPES = [
  {
    name: "Document stores",
    icon: "📄",
    examples: "MongoDB, CouchDB, Firestore",
    model: "JSON-like documents grouped into collections. Each document is self-contained and can have a different structure.",
    strengths: "Rich nested data, flexible schema, fast reads when the document matches the query shape.",
    weaknesses: "Data duplication across documents. Cross-document transactions are complex.",
    use: "User profiles, product catalogs, CMS content, mobile app backends.",
  },
  {
    name: "Key-value stores",
    icon: "🗝️",
    examples: "Redis, Memcached, DynamoDB",
    model: "A giant dictionary. Every value is stored and retrieved by its exact key. Values can be strings, hashes, lists, sets, or sorted sets.",
    strengths: "Extremely fast O(1) reads and writes. Atomic operations. TTL support. Horizontal scaling via consistent hashing.",
    weaknesses: "No query language. You must know the key. Cannot filter or aggregate without maintaining secondary index keys manually.",
    use: "Session storage, caching, rate limiting, leaderboards, pub/sub messaging.",
  },
  {
    name: "Columnar stores",
    icon: "📊",
    examples: "Apache Cassandra, HBase, ScyllaDB",
    model: "Data is stored column by column rather than row by row. Each row can have different columns. Optimized for writing and reading large volumes of data across many rows.",
    strengths: "Linear write scalability across nodes. Excellent for time-series and append-heavy workloads. Efficient compression of column data.",
    weaknesses: "Query patterns must be designed at schema time. No JOINs. Data modeling is access-pattern-driven and complex.",
    use: "IoT telemetry, analytics, time-series metrics, event logs, anything written at massive scale.",
  },
  {
    name: "Graph databases",
    icon: "🕸️",
    examples: "Neo4j, Amazon Neptune, TigerGraph",
    model: "Nodes (entities) and edges (relationships) as first-class citizens. Traversing relationships is as fast as a lookup, regardless of graph size.",
    strengths: "Natural fit for highly connected data. Relationship queries that would require many JOINs in SQL are single traversals.",
    weaknesses: "Not general-purpose. Poor fit for tabular or document data. Smaller ecosystem and fewer hosted options.",
    use: "Social graphs, fraud detection, recommendation engines, knowledge graphs, network topology.",
  },
];

export function NoSQLTypesSection() {
  return (
    <section>
      <h2 id="nosql-types" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        NoSQL: Four Different Models
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        NoSQL is not a single technology. It is a category of databases that reject the relational
        model in favor of data structures better suited to specific access patterns. Document,
        key-value, columnar, and graph databases each make fundamentally different trade-offs.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-6">
        The explorer below shows how the same social post data would be stored and queried
        in three different paradigms. Switch between them to see how the data model shapes
        what queries are easy and what becomes hard.
      </p>

      <DataModelExplorer />

      <div className="space-y-3 mt-4">
        {NOSQL_TYPES.map(({ name, icon, examples, model, strengths, weaknesses, use }) => (
          <div key={name} className="rounded-xl border border-brand-border bg-white overflow-hidden">
            <div className="px-4 py-3 bg-brand-surface/50 border-b border-brand-border flex items-center gap-2">
              <span>{icon}</span>
              <span className="text-[13px] font-semibold text-brand-text">{name}</span>
              <span className="ml-auto text-[10px] text-brand-text-muted font-mono">{examples}</span>
            </div>
            <div className="p-4 space-y-3 text-[12px]">
              <p className="text-brand-text-muted leading-relaxed">{model}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-brand-primary mb-1">Strengths</p>
                  <p className="text-brand-text-muted">{strengths}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-brand-warning mb-1">Weaknesses</p>
                  <p className="text-brand-text-muted">{weaknesses}</p>
                </div>
              </div>
              <p className="text-[11px] text-brand-text-muted border-t border-brand-border/50 pt-2">
                <span className="font-semibold text-brand-text">Best for: </span>
                {use}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
