const SAFE_SEQUENCE = [
  {
    step: "Deploy 1",
    label: "Add the new column (nullable or with default)",
    code: `# alembic migration: add column
def upgrade():
    op.add_column("tasks", sa.Column(
        "priority",
        sa.Integer(),
        nullable=True,  # must be nullable — old code cannot set it
    ))


def downgrade():
    op.drop_column("tasks", "priority")`,
    note: "Old code still runs. It does not know about the new column and ignores it. New column is NULL for existing rows.",
  },
  {
    step: "Deploy 2",
    label: "Ship new code that reads and writes the new column",
    code: `# New code reads and writes priority.
# Old code (if any instances still running) safely ignores the column.
class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    priority: Mapped[int | None] = mapped_column(default=None)`,
    note: "New code writes to the column. Old code still works because the column is nullable.",
  },
  {
    step: "Deploy 3 (optional)",
    label: "Backfill historical rows, then add the NOT NULL constraint",
    code: `# If priority must eventually be NOT NULL, do it in a separate deploy
# after all rows have been backfilled.
def upgrade():
    # Batched backfill: do not lock the table
    connection = op.get_bind()
    connection.execute(text(
        "UPDATE tasks SET priority = 0 WHERE priority IS NULL"
    ))
    op.alter_column("tasks", "priority", nullable=False)`,
    note: "Safe only after all running instances write the column. Never combine column addition and NOT NULL constraint in one migration.",
  },
];

const DANGEROUS_PATTERNS = [
  {
    pattern: "Rename a column in the same deploy as the code change",
    why: "Old code reads the old name. New code reads the new name. During the rollout, both versions run simultaneously. One of them fails.",
  },
  {
    pattern: "Remove a column in the same deploy as the code change",
    why: "Same reason. Old instances fail immediately after the migration runs because the column they reference is gone.",
  },
  {
    pattern: "Change a column type that narrows the domain (varchar(500) to varchar(100))",
    why: "Existing values longer than 100 characters will fail validation. Run a data audit first. Never narrow a column type without verifying no existing data violates the new constraint.",
  },
];

export function MigrationStrategySection() {
  return (
    <section id="migration-strategy">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Additive-Only Migrations</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A rolling deployment means old and new code run simultaneously for minutes. Any
        migration that old code cannot survive will cause 500s during that window.
        The safe rule: never remove, rename, or change a column in the same deployment
        as the code that uses it.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Adding a column with the three-deploy expand-contract sequence is always safe:
      </p>

      <div className="space-y-3 mb-6">
        {SAFE_SEQUENCE.map(({ step, label, code, note }) => (
          <div key={step} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[9px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">{step}</span>
              <span className="text-[11px] font-semibold">{label}</span>
            </div>
            <div className="p-4 space-y-3">
              <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
                {code}
              </pre>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{note}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-4">Patterns that cause downtime</h3>

      <div className="space-y-3">
        {DANGEROUS_PATTERNS.map(({ pattern, why }) => (
          <div key={pattern} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-destructive/5">
              <span className="text-[11px] font-semibold text-destructive/80">{pattern}</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed">{why}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
