const TIMELINE_PHASES = [
  {
    phase: "Expand",
    deploy: "Deploy 1",
    migration: "Add priority column (nullable)",
    code: "Old code runs. Ignores the new column.",
    state: "Both old and new column structure coexist. Old code is unaffected.",
    color: "border-emerald-500/30 bg-emerald-500/5",
    badge: "bg-emerald-500/10 text-emerald-600",
  },
  {
    phase: "Use",
    deploy: "Deploy 2",
    migration: "No migration",
    code: "New code reads and writes priority.",
    state: "Old instances (if any remain) skip the column. New instances write it.",
    color: "border-primary/30 bg-primary/5",
    badge: "bg-primary/10 text-primary",
  },
  {
    phase: "Contract",
    deploy: "Deploy 3",
    migration: "Backfill + add NOT NULL constraint",
    code: "No code change. Migration runs after all old instances are gone.",
    state: "Column is now required. All rows have values. Old nullable contract is gone.",
    color: "border-amber-500/30 bg-amber-500/5",
    badge: "bg-amber-500/10 text-amber-600",
  },
];

const RENAME_SEQUENCE = `# Renaming a column safely takes four deploys, not one.

# Deploy 1: add the new column
op.add_column("tasks", sa.Column("due_date", sa.DateTime(), nullable=True))

# Deploy 2: write to BOTH old and new column in code
task.deadline = value        # old column (still being read by old instances)
task.due_date = value        # new column

# Deploy 3: read from new column only
# Old column is no longer written. Old instances are fully retired.
task.due_date = value

# Deploy 4: drop the old column
op.drop_column("tasks", "deadline")`;

export function ExpandContractSection() {
  return (
    <section id="expand-contract">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">The Expand-Contract Pattern</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Expand-contract is a formalization of the additive migration rule. Every schema
        change goes through three phases: expand the schema to accommodate both the old
        and new state simultaneously, use the new state in code, then contract by removing
        the old state once old code is gone. The key insight is that old and new versions
        of the code run at the same time during any rolling deployment.
      </p>

      <div className="space-y-3 mb-8">
        {TIMELINE_PHASES.map(({ phase, deploy, migration, code, state, color, badge }) => (
          <div key={phase} className={`rounded-xl border p-4 ${color}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold ${badge}`}>
                {phase}
              </span>
              <span className="text-[11px] font-semibold">{deploy}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1">Migration</p>
                <p className="text-muted-foreground">{migration}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1">Code</p>
                <p className="text-muted-foreground">{code}</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground/70 mt-2 border-t border-border/50 pt-2">
              {state}
            </p>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-4">Renaming a column requires four deploys</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Renaming is the most disruptive schema change because it requires a period where
        code writes to both the old and new column name simultaneously. A naive rename
        in one deploy breaks the live version immediately.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          renaming deadline to due_date (four deploys)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {RENAME_SEQUENCE}
        </pre>
      </div>
    </section>
  );
}
