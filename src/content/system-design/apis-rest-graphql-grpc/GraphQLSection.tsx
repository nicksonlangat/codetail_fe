import { APIComparator } from "@/components/blog/interactive/api-comparator";

const OPERATION_TYPES = [
  {
    type: "Query",
    direction: "Read",
    analogy: "GET",
    example: "query { user(id: 42) { name email } }",
    desc: "Fetches data. Safe and idempotent. May be batched and cached.",
  },
  {
    type: "Mutation",
    direction: "Write",
    analogy: "POST / PUT / DELETE",
    example: 'mutation { createPost(title: "Hello") { id } }',
    desc: "Modifies data. Executed serially (top-to-bottom) when multiple mutations are sent.",
  },
  {
    type: "Subscription",
    direction: "Streaming",
    analogy: "WebSocket",
    example: "subscription { newComment(postId: 42) { text author { name } } }",
    desc: "Long-lived connection. Server pushes events to the client when data changes.",
  },
];

const TRADEOFFS = [
  {
    label: "Caching is harder",
    desc: "REST GET requests are cacheable by URL. GraphQL typically uses POST for all queries, which HTTP caches ignore. You must implement application-level caching (persisted queries, CDN rules keyed on query hash).",
    type: "cost",
  },
  {
    label: "N+1 on the server",
    desc: "Resolving author for 100 posts fires 100 SELECT queries unless you use DataLoader. DataLoader batches and deduplicates within a single tick: 100 author lookups become 1 SELECT WHERE id IN (...).",
    type: "cost",
  },
  {
    label: "Schema is a contract",
    desc: "The GraphQL schema is explicit, introspectable, and versioned by default. Clients cannot request fields that do not exist. Tooling (GraphiQL, Apollo Studio) generates documentation automatically.",
    type: "benefit",
  },
  {
    label: "One endpoint, all operations",
    desc: "A single /graphql endpoint replaces dozens of REST endpoints. Routing is by operation name, not URL. This simplifies load balancing but makes per-endpoint rate limiting and monitoring harder.",
    type: "neutral",
  },
  {
    label: "Over-fetching eliminated",
    desc: "Clients specify exactly the fields they need. A mobile app requesting a user card gets name and avatarUrl. A desktop dashboard requesting a full profile gets all 30 fields. One schema, multiple shapes.",
    type: "benefit",
  },
  {
    label: "Arbitrary query depth",
    desc: "Without query depth limits or complexity scoring, a malicious client can craft deeply nested queries (user -> posts -> comments -> author -> posts ...) that exhaust the server. Protect with depth limits and query cost analysis.",
    type: "cost",
  },
];

export function GraphQLSection() {
  return (
    <section>
      <h2 id="graphql" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        GraphQL: Query What You Need
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        GraphQL was developed at Facebook in 2012 and open-sourced in 2015. The motivation was
        direct: the News Feed required data from dozens of different backend services, and REST
        endpoints could not express the variable, nested, client-driven shape of that data
        efficiently. GraphQL moves the query language to the client side.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        At the center is the schema. The server defines a type system: every object type, every
        field, every relationship between types. Clients write queries in the GraphQL query language
        that traverse this type graph. The server validates queries against the schema at parse time
        and returns exactly the fields requested, nothing more, nothing less.
      </p>

      <div className="mb-8">
        <APIComparator />
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Three operation types</h3>

      <div className="space-y-3 mb-8">
        {OPERATION_TYPES.map(({ type, direction, analogy, example, desc }) => (
          <div key={type} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold text-primary font-mono">{type}</span>
              <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{direction}</span>
              <span className="text-[9px] text-muted-foreground ml-auto">REST analogy: {analogy}</span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <pre className="text-[10px] font-mono bg-muted/50 rounded-lg px-3 py-2 overflow-x-auto">{example}</pre>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Schema design: a minimal example</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">Schema definition language (SDL)</p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`type Query {
  post(id: ID!): Post
  posts(first: Int = 20, after: String): PostConnection
  user(id: ID!): User
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
  deletePost(id: ID!): Boolean!
}

type Post {
  id: ID!
  title: String!
  excerpt: String
  commentCount: Int!
  author: User!          # resolved separately — DataLoader target
  tags: [Tag!]!
  createdAt: DateTime!
}

type User {
  id: ID!
  name: String!
  avatarUrl: String
}

type Tag { name: String! }

input CreatePostInput {
  title: String!
  excerpt: String
}

# Relay-style cursor pagination
type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
}
type PostEdge { node: Post!; cursor: String! }
type PageInfo { hasNextPage: Boolean!; endCursor: String }`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The DataLoader pattern</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The most common GraphQL performance bug is the N+1 problem. When you resolve a list of
        100 posts and each post resolver independently fetches its author, you execute 101 queries.
        DataLoader solves this by collecting all keys within a single event loop tick and issuing
        a single batched query.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6 not-prose">
        <div className="bg-card border border-destructive/20 rounded-xl p-4">
          <p className="text-[9px] uppercase tracking-wider text-destructive mb-2">Without DataLoader</p>
          <pre className="text-[10px] font-mono bg-muted rounded-lg px-3 py-2 overflow-x-auto leading-relaxed text-destructive/80">
{`// posts resolver
posts.forEach(post => {
  // N separate queries
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [post.authorId]
  );
});
// 100 posts = 101 queries`}
          </pre>
        </div>
        <div className="bg-card border border-primary/20 rounded-xl p-4">
          <p className="text-[9px] uppercase tracking-wider text-primary mb-2">With DataLoader</p>
          <pre className="text-[10px] font-mono bg-muted rounded-lg px-3 py-2 overflow-x-auto leading-relaxed text-primary/80">
{`const userLoader = new DataLoader(
  async (ids) => {
    const users = await db.query(
      "SELECT * FROM users WHERE id = ANY(?)",
      [ids]
    );
    return ids.map(id =>
      users.find(u => u.id === id)
    );
  }
);
// 100 posts = 2 queries total`}
          </pre>
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Benefits and costs</h3>

      <div className="space-y-2 mb-6">
        {TRADEOFFS.map(({ label, desc, type }) => (
          <div key={label} className={`flex gap-3 p-3 rounded-xl border ${
            type === "benefit" ? "border-primary/20 bg-primary/5" :
            type === "cost" ? "border-orange-400/20 bg-orange-400/5" :
            "border-border bg-card"
          }`}>
            <span className={`text-sm flex-shrink-0 mt-0.5 ${
              type === "benefit" ? "text-primary" :
              type === "cost" ? "text-orange-500" :
              "text-muted-foreground"
            }`}>
              {type === "benefit" ? "+" : type === "cost" ? "−" : "~"}
            </span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{label}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
