const DETECTION_TOOLS = [
  {
    framework: "Django",
    tool: "django-debug-toolbar / connection.queries",
    detail:
      'Enable DEBUG=True and check len(connection.queries) in tests. The debug toolbar shows total query count per request in the browser.',
  },
  {
    framework: "SQLAlchemy",
    tool: "echo=True on create_engine",
    detail:
      "Set echo=True to print every SQL statement to stdout. For tests, wrap with a query counter using event.listen('before_cursor_execute', ...).",
  },
  {
    framework: "Prisma (Node)",
    tool: "log: ['query'] in PrismaClient",
    detail:
      "Pass log: ['query'] to the PrismaClient constructor. Every SQL statement is printed. Count repeated queries with the same shape.",
  },
  {
    framework: "ActiveRecord (Rails)",
    tool: "bullet gem",
    detail:
      "Bullet detects N+1 queries automatically and raises an alert or logs a warning when eager loading would help.",
  },
];

export function DetectingSection() {
  return (
    <section>
      <h2 id="detecting" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Detecting N+1 Queries
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The most reliable detection method is to count queries per request during
        development and test. A list endpoint that fetches 50 rows should run 1 to 3
        queries — not 51. Any endpoint where query count is proportional to row count
        has an N+1 problem.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Counting queries in tests</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# Django: assert query count in a test
from django.test import TestCase
from django.db import connection

class PostListTests(TestCase):
    def test_list_does_not_n_plus_one(self):
        Post.objects.bulk_create([
            Post(title=f"Post {i}", author=self.author) for i in range(50)
        ])

        with self.assertNumQueries(2):   # 1 for posts, 1 for authors
            response = self.client.get("/api/posts/")

        self.assertEqual(response.status_code, 200)`}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# SQLAlchemy: count queries with an event listener
from sqlalchemy import event

query_count = 0

@event.listens_for(engine, "before_cursor_execute")
def count_queries(conn, cursor, statement, *args):
    global query_count
    query_count += 1

# Reset before each test, then assert after:
query_count = 0
result = fetch_posts_with_authors(session)
assert query_count <= 2, f"Expected 2 queries, got {query_count}"`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The recognizable pattern</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When reviewing query logs, N+1 has a specific shape. Once you know it, it is
        immediately recognizable.
      </p>

      <div className="space-y-2 mb-8">
        {[
          {
            signal: "Repeated queries to the same table",
            desc: "Multiple SELECT statements targeting the same table, interleaved between statements targeting other tables. Each fires after the previous one completes.",
          },
          {
            signal: "Same query shape, different WHERE value",
            desc: "SELECT * FROM users WHERE id = 3 followed by SELECT * FROM users WHERE id = 7 followed by SELECT * FROM users WHERE id = 3 again. Identical structure, cycling through different IDs.",
          },
          {
            signal: "Query count matches row count",
            desc: "The first query returns 50 rows. The log shows 50 more queries immediately after. The correlation is exact.",
          },
          {
            signal: "The same row fetched multiple times",
            desc: "The same primary key appears in the WHERE clause of multiple queries. The ORM has no cross-request cache, so each access re-fetches the row.",
          },
        ].map(({ signal, desc }) => (
          <div key={signal} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{signal}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Detection tools by framework</h3>

      <div className="space-y-2">
        {DETECTION_TOOLS.map(({ framework, tool, detail }) => (
          <div key={framework} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[10px] font-semibold text-primary">{framework}</span>
              <span className="font-mono text-[9px] text-muted-foreground">{tool}</span>
            </div>
            <p className="px-4 py-2.5 text-[11px] text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
