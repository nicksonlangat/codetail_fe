import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const DB_ENGINES = `from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os

# Primary: accepts reads and writes
primary_engine = create_async_engine(
    os.getenv("DATABASE_PRIMARY_URL"),
    pool_size=10,
    max_overflow=20,
)

# Replica: reads only (lag of ~50-200ms behind primary)
replica_engine = create_async_engine(
    os.getenv("DATABASE_REPLICA_URL"),
    pool_size=20,   # larger pool: reads are more frequent
    max_overflow=40,
)

PrimarySession = sessionmaker(primary_engine, class_=AsyncSession, expire_on_commit=False)
ReplicaSession = sessionmaker(replica_engine, class_=AsyncSession, expire_on_commit=False)


async def get_primary_db():
    async with PrimarySession() as session:
        yield session


async def get_replica_db():
    async with ReplicaSession() as session:
        yield session`;

const ROUTING_DIFF: DiffLine[] = [
  { type: "context", content: "@app.get(\"/tasks/{task_id}\", response_model=TaskDetail)" },
  { type: "context", content: "async def get_task(" },
  { type: "context", content: "    task_id: int," },
  { type: "removed", content: "    db: AsyncSession = Depends(get_db)," },
  { type: "added",   content: "    db: AsyncSession = Depends(get_replica_db),  # reads go to replica" },
  { type: "context", content: "    current_user: User = Depends(get_current_user)," },
  { type: "context", content: "):" },
  { type: "context", content: "    ..." },
  { type: "context", content: "" },
  { type: "context", content: "" },
  { type: "context", content: "@app.post(\"/tasks\", status_code=202)" },
  { type: "context", content: "async def create_task(" },
  { type: "context", content: "    body: TaskCreate," },
  { type: "removed", content: "    db: AsyncSession = Depends(get_db)," },
  { type: "added",   content: "    db: AsyncSession = Depends(get_primary_db),  # writes go to primary" },
  { type: "context", content: "    current_user: User = Depends(get_current_user)," },
  { type: "context", content: "):" },
  { type: "context", content: "    ..." },
];

const REPLICATION_LAG_NOTE = `# Replication lag: 50-200ms is typical on a well-provisioned streaming replica.
# Implications:
#
# Immediately after a write, a read from the replica may return the old value.
# This is a problem for read-after-write patterns:
#
#   POST /tasks  -> writes to primary
#   GET /tasks/{id}  -> reads from replica (may miss the new task for 100ms)
#
# Solutions:
# 1. Read-after-write: after a write, read from primary for one request
# 2. Sticky routing: route the user to primary reads for 500ms after a write
# 3. Accept the lag: for most task reads, 200ms lag is imperceptible
#
# This series uses option 3: accept the lag. The task is written, returned in
# the 202 response, and cached in Redis immediately -- so the next GET will
# likely be a cache hit, not a replica read.`;

export function ReadReplicasSection() {
  return (
    <section id="read-replicas">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Read Replicas</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A read replica is a copy of the primary database that streams changes
        asynchronously and accepts only reads. Routing all read traffic to a replica
        removes that load from the primary, leaving it free for writes and reducing
        the risk of read and write queries competing for locks.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The implementation is two SQLAlchemy engines with two dependency functions. Read
        endpoints depend on{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">get_replica_db</code>.
        Write endpoints depend on{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">get_primary_db</code>.
        The replica pool is larger because reads are more frequent than writes.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          database.py -- primary and replica engines
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {DB_ENGINES}
        </pre>
      </div>

      <CodeDiff filename="main.py" before="" after="" diff={ROUTING_DIFF} />

      <div className="bg-card border border-border rounded-xl p-4 mt-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          replication lag and read-after-write
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {REPLICATION_LAG_NOTE}
        </pre>
      </div>
    </section>
  );
}
