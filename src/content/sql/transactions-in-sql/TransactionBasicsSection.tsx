export function TransactionBasicsSection() {
  return (
    <section>
      <h2 id="begin-commit-rollback" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        BEGIN, COMMIT, ROLLBACK
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A transaction groups multiple SQL statements into a single unit. Either all of them succeed and their changes become permanent, or none of them do. There is no partial outcome.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        By default, most databases run in autocommit mode — every statement is its own transaction that commits immediately. To group statements, you start an explicit transaction with BEGIN.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Transfer $100 from account A to account B
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';

COMMIT;  -- both updates become permanent together`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        If the second UPDATE fails — say account B does not exist — you want to undo the first UPDATE too. ROLLBACK cancels every change made since BEGIN and returns the database to the state it was in before the transaction started.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
-- Something goes wrong:
UPDATE accounts SET balance = balance + 100 WHERE id = 'INVALID';

ROLLBACK;  -- the first UPDATE is undone, no money leaves account A

-- In application code, this is usually handled in a try/catch:
-- BEGIN
-- ...statements...
-- COMMIT on success, ROLLBACK on exception`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">What transactions protect</h3>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "Atomicity",
            detail: "all or nothing",
            desc: "Every statement in the transaction either commits together or rolls back together. A crash mid-transaction leaves no partial changes — the database recovers to the pre-transaction state.",
          },
          {
            label: "Consistency",
            detail: "constraints hold before and after",
            desc: "The database enforces all constraints — foreign keys, NOT NULL, CHECK — at commit time. A transaction cannot leave the database in a state that violates its rules.",
          },
          {
            label: "Locks held until COMMIT",
            detail: "writes block other writers",
            desc: "Row-level locks acquired during a transaction are held until COMMIT or ROLLBACK. Other transactions that try to modify the same rows wait. Long transactions increase contention.",
          },
          {
            label: "Autocommit vs explicit transactions",
            detail: "single statement vs grouped statements",
            desc: "In autocommit mode, each statement commits immediately. Use explicit BEGIN/COMMIT when you need multiple statements to succeed or fail together.",
          },
        ].map(({ label, detail, desc }) => (
          <div key={label} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center gap-3">
              <p className="text-[11px] font-semibold">{label}</p>
              <span className="text-[10px] text-muted-foreground">{detail}</span>
            </div>
            <div className="px-4 py-3 text-[11px] text-muted-foreground">
              {desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
