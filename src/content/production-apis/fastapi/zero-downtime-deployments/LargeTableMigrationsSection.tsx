const ADD_INDEX_SAFE = `# UNSAFE: blocks reads and writes on the tasks table while the index builds
def upgrade():
    op.create_index("ix_tasks_user_created", "tasks", ["user_id", "created_at"])


# SAFE: builds the index without locking the table
def upgrade():
    op.execute(
        "CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_tasks_user_created "
        "ON tasks (user_id, created_at DESC)"
    )`;

const BATCHED_BACKFILL = `# UNSAFE: one UPDATE touching 10M rows acquires a lock for minutes
def upgrade():
    op.execute("UPDATE tasks SET priority = 0 WHERE priority IS NULL")


# SAFE: update in batches of 1,000, release the lock between batches
def upgrade():
    connection = op.get_bind()
    while True:
        result = connection.execute(text(
            """UPDATE tasks SET priority = 0
               WHERE id IN (
                 SELECT id FROM tasks
                 WHERE priority IS NULL
                 LIMIT 1000
               )"""
        ))
        if result.rowcount == 0:
            break`;

const MIGRATION_CHECKLIST = [
  {
    item: "Adding a column",
    safe: true,
    notes: "Always safe if nullable or has a default. Use additive migrations — code change comes after.",
  },
  {
    item: "Dropping a column",
    safe: false,
    notes: "Only safe after all code that references the column has been removed and deployed.",
  },
  {
    item: "Creating an index",
    safe: false,
    notes: "Locks the table. Use CREATE INDEX CONCURRENTLY. Cannot run inside a transaction.",
  },
  {
    item: "Backfilling a large column",
    safe: false,
    notes: "Locks rows. Use batched updates of 500-5000 rows with a small sleep between batches.",
  },
  {
    item: "Adding a NOT NULL constraint",
    safe: false,
    notes: "Scans the entire table to verify no NULLs. Do only after backfilling, in a separate deploy.",
  },
  {
    item: "Changing a column type",
    safe: false,
    notes: "Rewrites the entire table. Use a new column + backfill + rename sequence across multiple deploys.",
  },
];

export function LargeTableMigrationsSection() {
  return (
    <section id="large-table-migrations">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Large-Table Migrations</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A migration that takes 200ms on a development database with 100 rows takes 40
        minutes on a production database with 50 million rows — and holds a table lock
        the entire time. Every read and write on the table queues behind the migration.
        The result is an outage that Alembic calls a successful upgrade.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Two operations require special handling: index creation and large-table backfills.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          index creation: unsafe vs safe
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {ADD_INDEX_SAFE}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          large backfill: unsafe vs safe
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {BATCHED_BACKFILL}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-4">Migration safety reference</h3>

      <div className="space-y-2">
        {MIGRATION_CHECKLIST.map(({ item, safe, notes }) => (
          <div key={item} className="flex gap-3 items-start p-3 bg-card border border-border rounded-xl">
            <span className={`text-[10px] font-mono mt-0.5 shrink-0 px-1.5 py-0.5 rounded ${
              safe
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}>
              {safe ? "safe" : "risky"}
            </span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{item}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{notes}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">CREATE INDEX CONCURRENTLY has one constraint</p>
        <p className="text-muted-foreground">
          It cannot run inside a transaction. Alembic wraps each migration in a transaction
          by default. Add{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">op.execute("COMMIT")</code>{" "}
          before the CONCURRENTLY command or set{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">transaction_per_migration = False</code>{" "}
          in your Alembic env.py. Index creation failures leave a partial index — check for
          and drop invalid indexes before retrying.
        </p>
      </div>
    </section>
  );
}
