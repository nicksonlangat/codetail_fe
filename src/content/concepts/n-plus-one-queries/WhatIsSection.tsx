export function WhatIsSection() {
  return (
    <section>
      <h2 id="what-is" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        What the N+1 Problem Is
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The N+1 query problem occurs when code fetches a list of records, then executes
        a separate database query for each record to load associated data. One query to
        get the list, then N queries — one per row — to load the related data. The total
        number of queries scales linearly with the result set size.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        At small scale it is unnoticeable. At 50 rows with a 2ms round-trip per query, the
        endpoint takes 100ms longer than necessary. At 500 rows, that becomes a full second.
        The problem worsens as the dataset grows — exactly when performance matters most.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">The pattern in code</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# Query 1: fetch all posts
posts = Post.objects.all()[:50]

# This loop fires one query per post — 50 additional queries
for post in posts:
    print(post.author.name)   # SELECT * FROM users WHERE id = ?

# Total: 51 queries to render 50 posts.
# Nothing in the code signals that post.author hits the database.`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">What the query log looks like</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed text-muted-foreground">
{`SELECT * FROM posts LIMIT 50;
SELECT * FROM users WHERE id = 3;
SELECT * FROM users WHERE id = 7;
SELECT * FROM users WHERE id = 3;    -- same author, fetched again
SELECT * FROM users WHERE id = 12;
SELECT * FROM users WHERE id = 7;    -- same author, fetched again
... (45 more) ...
SELECT * FROM users WHERE id = 19;`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Two signals appear in the log. First, the same row is fetched repeatedly: multiple
        posts share authors, but the ORM fetches each one fresh. Second, every query has
        the same shape with a different WHERE value. Both patterns indicate an N+1 problem.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Why ORMs make it invisible</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            label: "Lazy loading by default",
            desc: "Most ORMs load related objects on first access, not when the parent is fetched. post.author looks like a property. The SELECT is invisible in the code.",
          },
          {
            label: "The loop looks like normal code",
            desc: "Iterating a list and reading attributes is standard Python. There is no visual marker that each iteration is a round-trip to the database.",
          },
          {
            label: "It works in development",
            desc: "With 10 rows and a local database, 11 queries take a few milliseconds. The problem only surfaces in production, with real data volumes and network latency.",
          },
          {
            label: "No error is raised",
            desc: "The endpoint returns correct data. No exception, no warning, no observable difference in behavior — just a slow response time that worsens at scale.",
          },
        ].map(({ label, desc }) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
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
