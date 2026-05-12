export function SolvingSection() {
  return (
    <section>
      <h2 id="solving" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Solving N+1 Queries
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Two solutions cover the majority of N+1 problems: a JOIN that fetches all data in
        one query, and eager loading that fetches related records in a second batched
        query using an IN clause. For nested resolvers in GraphQL APIs, the DataLoader
        pattern extends eager loading to arbitrary nesting depth.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Solution 1: JOIN</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A JOIN fetches the parent and all related data in a single query. One round-trip
        to the database. The result set is larger, but the latency is dramatically lower
        than N round-trips.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2">SQL</p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- One query, all data
SELECT posts.*, users.name AS author_name
  FROM posts
  JOIN users ON posts.author_id = users.id
 LIMIT 50;`}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Django ORM</p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# select_related follows foreign keys with a JOIN
posts = Post.objects.select_related("author")[:50]

for post in posts:
    print(post.author.name)   # no additional query — data already loaded`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Solution 2: Eager loading (prefetch)</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Eager loading runs two queries: one for the parent records, then one batched query
        using an IN clause to fetch all related records at once. The ORM then assembles
        the results in memory. Two queries regardless of how many rows the first query returns.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2">What the queries look like</p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed text-muted-foreground">
{`-- Query 1: fetch posts
SELECT * FROM posts LIMIT 50;

-- Query 2: fetch ALL authors in one batched query
SELECT * FROM users WHERE id IN (3, 7, 12, 19, ...);`}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Django ORM</p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# prefetch_related uses an IN clause instead of a JOIN
# Better for many-to-many and reverse FK relationships
posts = Post.objects.prefetch_related("comments")[:50]

for post in posts:
    for comment in post.comments.all():   # already in memory
        print(comment.body)`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">JOIN vs prefetch: when to use which</h3>

      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {[
          {
            approach: "JOIN (select_related)",
            when: "Loading a single related object via a foreign key. One post has one author.",
            tradeoff: "Larger result rows. Duplicates parent data if there are many related rows (use prefetch for one-to-many).",
          },
          {
            approach: "Prefetch (prefetch_related)",
            when: "Loading a list of related objects: comments on a post, tags on an article, items in an order.",
            tradeoff: "Two queries instead of one. Assembles the result in Python memory. Slightly more overhead for very small datasets.",
          },
        ].map(({ approach, when: w, tradeoff }) => (
          <div key={approach} className="p-4 bg-card border border-border rounded-xl">
            <p className="text-[12px] font-semibold text-primary mb-1">{approach}</p>
            <p className="text-[11px] text-muted-foreground mb-2">
              <span className="font-medium text-foreground/80">Use when: </span>
              {w}
            </p>
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium text-orange-500">Trade-off: </span>
              {tradeoff}
            </p>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The DataLoader pattern for APIs</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        In a GraphQL API, each resolver fetches its own data. A query for 50 posts each
        with an author resolver will trigger 50 author fetches with no obvious place to
        add a JOIN or prefetch. DataLoader solves this by batching all fetches within
        a single event-loop tick into one IN query.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`from strawberry.dataloader import DataLoader
from typing import List

async def load_users(user_ids: List[int]) -> List[User]:
    # Called once with all IDs collected across the request,
    # not once per resolver invocation
    users = await db.fetch(
        "SELECT * FROM users WHERE id = ANY($1)", user_ids
    )
    by_id = {u.id: u for u in users}
    return [by_id.get(uid) for uid in user_ids]

user_loader = DataLoader(load_fn=load_users)

# In the resolver — looks like a single fetch, batches automatically
async def resolve_author(post: Post) -> User:
    return await user_loader.load(post.author_id)`}
        </pre>
      </div>
    </section>
  );
}
