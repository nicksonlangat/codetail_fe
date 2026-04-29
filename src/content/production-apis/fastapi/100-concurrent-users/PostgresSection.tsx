import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const BEFORE = `from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

SQLALCHEMY_DATABASE_URL = "sqlite:///./tasks.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()`;

const AFTER = `from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "postgresql+asyncpg://user:password@localhost/taskdb"

engine = create_async_engine(DATABASE_URL, pool_size=10, max_overflow=20)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session`;

const DIFF: DiffLine[] = [
  { type: "removed", content: "from sqlalchemy import create_engine" },
  { type: "added",   content: "from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession" },
  { type: "context", content: "from sqlalchemy.orm import sessionmaker, DeclarativeBase" },
  { type: "context", content: "" },
  { type: "removed", content: 'SQLALCHEMY_DATABASE_URL = "sqlite:///./tasks.db"' },
  { type: "added",   content: 'DATABASE_URL = "postgresql+asyncpg://user:password@localhost/taskdb"' },
  { type: "context", content: "" },
  { type: "removed", content: "engine = create_engine(" },
  { type: "removed", content: "    SQLALCHEMY_DATABASE_URL," },
  { type: "removed", content: '    connect_args={"check_same_thread": False},' },
  { type: "removed", content: ")" },
  { type: "removed", content: "SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)" },
  { type: "added",   content: "engine = create_async_engine(DATABASE_URL, pool_size=10, max_overflow=20)" },
  { type: "added",   content: "AsyncSessionLocal = sessionmaker(" },
  { type: "added",   content: "    engine, class_=AsyncSession, expire_on_commit=False" },
  { type: "added",   content: ")" },
  { type: "context", content: "" },
  { type: "context", content: "class Base(DeclarativeBase):" },
  { type: "context", content: "    pass" },
  { type: "context", content: "" },
  { type: "removed", content: "def get_db():" },
  { type: "removed", content: "    db = SessionLocal()" },
  { type: "removed", content: "    try:" },
  { type: "removed", content: "        yield db" },
  { type: "removed", content: "    finally:" },
  { type: "removed", content: "        db.close()" },
  { type: "added",   content: "async def get_db():" },
  { type: "added",   content: "    async with AsyncSessionLocal() as session:" },
  { type: "added",   content: "        yield session" },
];

export function PostgresSection() {
  return (
    <section id="postgres">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Migrating to PostgreSQL</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        PostgreSQL uses row-level locking rather than a file-level exclusive lock. Concurrent
        writers do not block each other unless they are modifying the same row. For a task
        API with independent task records, concurrent writes proceed without contention.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The driver is <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">asyncpg</code> --
        a pure-Python async PostgreSQL driver that integrates with SQLAlchemy's async engine.
        Two new dependencies replace the sync setup:
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          requirements.txt -- additions
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3">
{`asyncpg==0.29.0
psycopg2-binary==2.9.9   # for Alembic migrations (sync)`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The connection pool is configured with <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">pool_size=10</code> (persistent
        connections kept open) and <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">max_overflow=20</code> (additional connections
        allowed under burst load, closed when the burst subsides). At 100 concurrent
        requests this headroom prevents pool exhaustion.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The session dependency becomes async. Rather than manual try/finally,
        the async context manager handles cleanup -- the session is returned to the pool
        when the request handler exits, whether or not an exception was raised.
      </p>

      <CodeDiff filename="database.py" before={BEFORE} after={AFTER} diff={DIFF} />

      <div className="mt-4 space-y-2">
        {[
          {
            q: "Why pool_size=10 and max_overflow=20?",
            a: "pool_size determines how many connections are kept alive between requests. max_overflow allows temporary spikes above that. A total ceiling of 30 connections is safe for a single Postgres instance; the default Postgres max_connections is 100.",
          },
          {
            q: "Why psycopg2 alongside asyncpg?",
            a: "Alembic (the migration tool) uses synchronous database access. asyncpg is async-only. psycopg2 is added solely for running migrations; the application itself never uses it.",
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
