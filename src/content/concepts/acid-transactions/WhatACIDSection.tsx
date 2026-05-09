export function WhatACIDSection() {
  return (
    <section>
      <h2 id="what-acid" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        What ACID Actually Guarantees
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        ACID is a set of four guarantees that a database makes when you use transactions.
        Each letter describes a specific protection. Understanding what each one does —
        and does not — prevent is the difference between using transactions correctly
        and assuming they protect you from things they do not.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            letter: "A",
            name: "Atomicity",
            definition: "All operations in a transaction either commit together or none of them do.",
            what_it_prevents: "Partial writes. If a transaction updates two tables and the process crashes after the first update, the second update does not happen — and the first is rolled back.",
            what_it_does_not: "Logical errors. If the business logic is wrong and both updates commit incorrect values, they both commit. Atomicity does not validate your logic.",
          },
          {
            letter: "C",
            name: "Consistency",
            definition: "A committed transaction leaves the database in a valid state that satisfies all defined constraints.",
            what_it_prevents: "Constraint violations. A foreign key reference to a non-existent row. A NOT NULL field left null. A UNIQUE constraint violated. These cause the transaction to fail.",
            what_it_does_not: "Application-level invariants you have not encoded as constraints. If your invariant is 'a user cannot spend more than their balance', a CHECK constraint enforces it — but only if you defined one.",
          },
          {
            letter: "I",
            name: "Isolation",
            definition: "Concurrent transactions behave as if they ran one after another, to the degree defined by the isolation level.",
            what_it_prevents: "At SERIALIZABLE: all concurrency anomalies. At READ COMMITTED (the default): dirty reads only. Isolation level determines the actual protection.",
            what_it_does_not: "All race conditions by default. READ COMMITTED does not prevent lost updates or check-then-act races. You must raise the isolation level or add explicit locks.",
          },
          {
            letter: "D",
            name: "Durability",
            definition: "A committed transaction survives crashes. The data is written to durable storage before the commit is acknowledged.",
            what_it_prevents: "Data loss on crash. PostgreSQL writes to a write-ahead log (WAL) before confirming the commit. A crash after commit but before a full checkpoint does not lose the data.",
            what_it_does_not: "Hardware failure beyond the durability boundary. A RAID failure, a corrupted disk, or a network partition to a replica are not covered by durability alone — that requires replication.",
          },
        ].map(({ letter, name, definition, what_it_prevents, what_it_does_not }) => (
          <div key={letter} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-[13px] font-bold flex items-center justify-center flex-shrink-0">
                {letter}
              </span>
              <p className="text-[11px] font-semibold">{name}</p>
            </div>
            <div className="px-4 py-3 space-y-2 text-[11px]">
              <p className="text-muted-foreground italic">{definition}</p>
              <p>
                <span className="font-medium text-primary">Prevents: </span>
                <span className="text-muted-foreground">{what_it_prevents}</span>
              </p>
              <p>
                <span className="font-medium text-orange-500">Does not prevent: </span>
                <span className="text-muted-foreground">{what_it_does_not}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">What a transaction looks like</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Transfer $100 from account A to account B.
-- Both updates must succeed or neither does.
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';

-- If anything fails between BEGIN and COMMIT, both updates roll back.
COMMIT;`}
        </pre>
      </div>
    </section>
  );
}
