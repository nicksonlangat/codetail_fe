import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const BEFORE = `from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime, UTC
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    done = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))`;

const AFTER = `from sqlalchemy import Column, Integer, String, Boolean, DateTime, Index
from datetime import datetime, UTC
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    done = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    __table_args__ = (
        Index("idx_tasks_created_at", "created_at"),
    )`;

const DIFF: DiffLine[] = [
  { type: "removed", content: "from sqlalchemy import Column, Integer, String, Boolean, DateTime" },
  { type: "added",   content: "from sqlalchemy import Column, Integer, String, Boolean, DateTime, Index" },
  { type: "context", content: "from datetime import datetime, UTC" },
  { type: "context", content: "from database import Base" },
  { type: "context", content: "" },
  { type: "context", content: "class Task(Base):" },
  { type: "context", content: '    __tablename__ = "tasks"' },
  { type: "context", content: "" },
  { type: "context", content: "    id = Column(Integer, primary_key=True)" },
  { type: "context", content: "    title = Column(String, nullable=False)" },
  { type: "context", content: "    description = Column(String, nullable=True)" },
  { type: "context", content: "    done = Column(Boolean, default=False)" },
  { type: "context", content: "    created_at = Column(DateTime, default=lambda: datetime.now(UTC))" },
  { type: "context", content: "" },
  { type: "added",   content: "    __table_args__ = (" },
  { type: "added",   content: '        Index("idx_tasks_created_at", "created_at"),' },
  { type: "added",   content: "    )" },
];

export function IndexSection() {
  return (
    <section id="index">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Adding the Index
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The list endpoint always orders by <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">created_at DESC</code>.
        Without an index on that column, PostgreSQL has no choice but to read every row,
        sort them all, and then discard all but the last 20. An index on
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> created_at</code> stores the
        rows pre-sorted, so the database can jump directly to the right position and
        read sequentially from there.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        PostgreSQL B-tree indexes support both ascending and descending traversal, so a single
        index on <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">created_at</code> serves
        queries ordered either way. The index also serves range conditions like
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> WHERE created_at &lt; cursor</code>,
        which cursor pagination relies on.
      </p>

      <CodeDiff filename="models.py" before={BEFORE} after={AFTER} diff={DIFF} />

      <div className="mt-6 bg-card border border-border rounded-xl p-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Equivalent raw SQL (for an existing table)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Run this on a production table without locking
CREATE INDEX CONCURRENTLY idx_tasks_created_at ON tasks (created_at);

-- Verify it was created and is being used
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'tasks';`}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Why CONCURRENTLY matters on live tables</p>
        <p className="text-muted-foreground">
          A standard <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">CREATE INDEX</code> locks
          the table for writes until the build completes. On a table with millions of rows this
          can take minutes -- blocking every POST /tasks request. The
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]"> CONCURRENTLY</code> option builds
          the index without a write lock. It takes longer and requires two table scans,
          but production traffic continues uninterrupted. Article 8 covers migration safety in depth.
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {[
          {
            q: "When does an index hurt rather than help?",
            a: "Every index adds overhead to INSERT, UPDATE, and DELETE because the index must stay consistent with the table. A table that is written 1,000 times per second and read 10 times per second should not have many indexes. For a task API where reads vastly outnumber writes, the read benefit dominates.",
          },
          {
            q: "Does this index serve the GET /tasks/{id} endpoint?",
            a: "No. The primary key index (on id) already serves that lookup. The created_at index only helps the list endpoint. Each query pattern needs its own supporting index -- there is no single index that helps everything.",
          },
        ].map(({ q, a }) => (
          <div key={q} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">?</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{q}</p>
              <p className="text-[11px] text-muted-foreground">{a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
