const ACID = [
  {
    letter: "A",
    name: "Atomicity",
    desc: "All operations in a transaction succeed or all fail. If a bank transfer debits account A but then crashes before crediting account B, the debit is rolled back. No partial writes.",
    example: "Transferring money: debit + credit is one atomic unit.",
  },
  {
    letter: "C",
    name: "Consistency",
    desc: "A transaction takes the database from one valid state to another. Constraints, triggers, and cascades are enforced. You cannot commit data that violates a foreign key constraint.",
    example: "Cannot insert a comment for a post_id that does not exist.",
  },
  {
    letter: "I",
    name: "Isolation",
    desc: "Concurrent transactions behave as if they ran serially. One transaction cannot see uncommitted changes from another. Isolation levels (read committed, serializable) tune the trade-off with performance.",
    example: "Two users buying the last ticket: only one succeeds.",
  },
  {
    letter: "D",
    name: "Durability",
    desc: "Once a transaction is committed, it survives crashes. Data is written to disk and flushed before the commit is acknowledged. The write-ahead log (WAL) enables crash recovery.",
    example: "Power loss after COMMIT does not lose the transaction.",
  },
];

const WHEN_SQL = [
  { label: "Financial systems", desc: "Account balances, transfers, ledgers. ACID guarantees mean money cannot vanish or be double-spent." },
  { label: "Complex reporting", desc: "SQL lets you write arbitrary queries across tables at query time, without pre-designing access patterns." },
  { label: "Highly relational data", desc: "If your data naturally forms a graph of entities with many-to-many relationships, the relational model fits cleanly." },
  { label: "Strict schema required", desc: "Regulated industries (healthcare, finance) often require enforced data types and constraints at the database level." },
];

export function RelationalSection() {
  return (
    <section>
      <h2 id="relational-databases" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Relational Databases and ACID
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A relational database organizes data into tables, each with a fixed schema of typed columns.
        Rows in one table reference rows in another via foreign keys. The database enforces these
        relationships and guarantees the correctness of every operation through a property set
        known as ACID.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        ACID is not just a marketing term. It is a concrete set of guarantees that make
        financial systems, inventory management, and any workload where correctness is
        non-negotiable possible to build reliably.
      </p>

      <div className="space-y-2 mb-8">
        {ACID.map(({ letter, name, desc, example }) => (
          <div key={letter} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[14px] font-black text-primary font-mono">{letter}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold mb-1">{name}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-2">{desc}</p>
              <p className="text-[10px] text-muted-foreground/70 italic">
                Example: {example}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">How the relational model works</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Normalized schema: users, posts, comments
        </p>
        <div className="grid sm:grid-cols-3 gap-2 text-[10px] font-mono">
          {[
            {
              table: "users",
              cols: ["id (PK)", "name", "email"],
              sample: ["1", "Alice", "alice@..."],
            },
            {
              table: "posts",
              cols: ["id (PK)", "user_id (FK)", "content"],
              sample: ["42", "1", "Hello world"],
            },
            {
              table: "comments",
              cols: ["id (PK)", "post_id (FK)", "content"],
              sample: ["7", "42", "Nice post!"],
            },
          ].map(({ table, cols, sample }) => (
            <div key={table} className="rounded-lg border border-border overflow-hidden">
              <div className="px-2 py-1.5 bg-secondary/60 font-semibold text-[9px] uppercase tracking-wider text-muted-foreground">
                {table}
              </div>
              {cols.map((col, i) => (
                <div key={col} className={`flex justify-between px-2 py-1 border-t border-border/40 ${
                  i === 0 ? "text-primary" : col.includes("FK") ? "text-orange-500" : "text-foreground/70"
                }`}>
                  <span>{col}</span>
                  <span className="text-muted-foreground">{sample[i]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-[9px] text-muted-foreground/50 mt-3">
          Each piece of data lives in exactly one place. Foreign keys link tables. JOINs assemble the full picture at query time.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">When SQL is the right choice</h3>

      <div className="grid gap-2 sm:grid-cols-2">
        {WHEN_SQL.map(({ label, desc }) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">✓</span>
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
