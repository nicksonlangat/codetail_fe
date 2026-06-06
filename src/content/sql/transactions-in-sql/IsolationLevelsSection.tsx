export function IsolationLevelsSection() {
  return (
    <section>
      <h2 id="isolation-levels" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Isolation Levels
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When two transactions run at the same time, they can interfere with each other in ways that produce unexpected results. Isolation levels control how much one transaction can see of another's uncommitted work.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Higher isolation means fewer anomalies but more contention — transactions wait longer for each other. Most databases default to READ COMMITTED, which prevents the most damaging anomaly (dirty reads) while keeping throughput high.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">The three anomalies</h3>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "Dirty read",
            detail: "reading another transaction's uncommitted data",
            desc: "Transaction A reads a row that transaction B has modified but not yet committed. If B rolls back, A has read data that never officially existed. This is the most severe anomaly.",
          },
          {
            label: "Non-repeatable read",
            detail: "same query returns different rows within one transaction",
            desc: "Transaction A reads a row. Transaction B updates and commits that row. Transaction A reads the same row again and gets a different value. The same SELECT returns different results within one transaction.",
          },
          {
            label: "Phantom read",
            detail: "same query returns different set of rows",
            desc: "Transaction A queries rows matching a condition. Transaction B inserts a new row that matches the condition and commits. Transaction A re-runs the same query and sees a new row that was not there before.",
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

      <h3 className="text-base font-semibold mt-8 mb-3">The four isolation levels</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`--                       Dirty  Non-repeatable  Phantom
-- READ UNCOMMITTED        yes       yes           yes
-- READ COMMITTED          no        yes           yes   <- default in most DBs
-- REPEATABLE READ         no        no            yes   <- default in MySQL
-- SERIALIZABLE            no        no            no

-- Set for the current transaction
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
-- ... statements ...
COMMIT;`}
        </pre>
      </div>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "READ UNCOMMITTED",
            detail: "no protection — rarely used",
            desc: "Can read uncommitted changes from other transactions. Dirty reads are possible. Almost never the right choice outside of analytics workloads that tolerate approximate data.",
          },
          {
            label: "READ COMMITTED",
            detail: "default in PostgreSQL, Oracle, SQL Server",
            desc: "Each statement sees only committed data at the moment it runs. Dirty reads are prevented. Non-repeatable reads are possible — two SELECT statements within the same transaction may see different committed values.",
          },
          {
            label: "REPEATABLE READ",
            detail: "default in MySQL",
            desc: "A transaction sees a consistent snapshot of committed data from the moment it started. Re-reading the same row always returns the same value. Phantom reads are still possible in theory, though MySQL's InnoDB implementation prevents them with gap locks.",
          },
          {
            label: "SERIALIZABLE",
            detail: "full isolation — highest contention",
            desc: "Transactions execute as if they ran one at a time. All three anomalies are prevented. The database uses range locks or conflict detection to achieve this, which reduces throughput significantly under concurrent load.",
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

      <h3 className="text-base font-semibold mt-8 mb-3">When to raise the isolation level</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Use REPEATABLE READ when a transaction reads the same rows multiple times
-- and needs a consistent view across those reads.
-- Example: calculate a report that runs several queries — you want all
-- queries to reflect the same point in time.

SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
SELECT SUM(balance) FROM accounts;          -- snapshot taken here
-- ... other work ...
SELECT COUNT(*) FROM accounts WHERE balance > 0;  -- same snapshot
COMMIT;

-- Use SERIALIZABLE when correctness depends on the absence of phantoms.
-- Example: "insert a row only if no similar row exists" — without
-- SERIALIZABLE, two concurrent transactions can both pass the check
-- and both insert, creating a duplicate.`}
        </pre>
      </div>
    </section>
  );
}
