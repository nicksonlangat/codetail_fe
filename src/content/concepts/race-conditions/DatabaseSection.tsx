const ISOLATION_LEVELS = [
  {
    level: "READ UNCOMMITTED",
    dirtyRead: true,
    nonRepeatableRead: true,
    phantomRead: true,
    desc: "One transaction can read uncommitted data from another. Rarely used. Allows the most anomalies.",
    default: false,
  },
  {
    level: "READ COMMITTED",
    dirtyRead: false,
    nonRepeatableRead: true,
    phantomRead: true,
    desc: "Default in PostgreSQL and Oracle. Only committed data is visible. Does not prevent a row from changing between two reads within the same transaction.",
    default: true,
  },
  {
    level: "REPEATABLE READ",
    dirtyRead: false,
    nonRepeatableRead: false,
    phantomRead: true,
    desc: "Default in MySQL InnoDB. A row read once reads the same value for the duration of the transaction. Does not prevent new rows from appearing.",
    default: false,
  },
  {
    level: "SERIALIZABLE",
    dirtyRead: false,
    nonRepeatableRead: false,
    phantomRead: false,
    desc: "Full isolation. Transactions behave as if they ran one after another. Highest correctness, highest lock contention, lowest throughput.",
    default: false,
  },
];

export function DatabaseSection() {
  return (
    <section>
      <h2 id="database" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Race Conditions in Databases
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Databases do not protect you from race conditions by default. READ COMMITTED, the
        default isolation level in PostgreSQL, prevents dirty reads but does not prevent
        lost updates. Two transactions can both read the same row, both modify it, and
        one write will silently overwrite the other.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The isolation level determines which anomalies the database prevents. Higher
        isolation means fewer anomalies. It also means more lock contention and lower
        throughput. Most systems stay at READ COMMITTED and add explicit locking where
        correctness requires it.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Isolation levels</h3>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Level</th>
              <th className="text-center py-2 pr-4 text-muted-foreground font-medium">Dirty read</th>
              <th className="text-center py-2 pr-4 text-muted-foreground font-medium">
                Non-repeatable read
              </th>
              <th className="text-center py-2 text-muted-foreground font-medium">Phantom read</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {ISOLATION_LEVELS.map(({ level, dirtyRead, nonRepeatableRead, phantomRead, default: isDefault }) => (
              <tr key={level}>
                <td className="py-2 pr-4 font-mono text-[10px] align-top">
                  <span className="text-foreground/80">{level}</span>
                  {isDefault && (
                    <span className="ml-1.5 text-[8px] px-1 py-0.5 rounded bg-primary/10 text-primary font-sans">
                      PG default
                    </span>
                  )}
                </td>
                <td className="py-2 pr-4 text-center align-top">
                  {dirtyRead ? (
                    <span className="text-destructive">possible</span>
                  ) : (
                    <span className="text-primary">prevented</span>
                  )}
                </td>
                <td className="py-2 pr-4 text-center align-top">
                  {nonRepeatableRead ? (
                    <span className="text-destructive">possible</span>
                  ) : (
                    <span className="text-primary">prevented</span>
                  )}
                </td>
                <td className="py-2 text-center align-top">
                  {phantomRead ? (
                    <span className="text-destructive">possible</span>
                  ) : (
                    <span className="text-primary">prevented</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The lost update problem</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Lost updates are the most common database race condition. Two transactions read
        the same row, both compute a new value, and one write overwrites the other. The
        first write is silently discarded. No error is raised.
      </p>

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="px-4 py-3">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
              Transaction A
            </p>
            {[
              "BEGIN;",
              "SELECT views FROM posts WHERE id = 1;",
              "-- reads: views = 100",
              "",
              "UPDATE posts SET views = 101 WHERE id = 1;",
              "COMMIT;",
            ].map((line, i) => (
              <div
                key={i}
                className="font-mono text-[10px] text-foreground/80 leading-relaxed min-h-[1.25rem]"
              >
                {line}
              </div>
            ))}
          </div>
          <div className="px-4 py-3">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
              Transaction B (concurrent)
            </p>
            {[
              "BEGIN;",
              "SELECT views FROM posts WHERE id = 1;",
              "-- reads: views = 100 (before A commits)",
              "",
              "UPDATE posts SET views = 101 WHERE id = 1;",
              "COMMIT;",
            ].map((line, i) => (
              <div
                key={i}
                className="font-mono text-[10px] text-foreground/80 leading-relaxed min-h-[1.25rem]"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-2.5 border-t border-border bg-destructive/5">
          <p className="text-[11px] text-destructive">
            Result: views = 101. Two page views recorded as one. Transaction A&apos;s increment
            was silently overwritten.
          </p>
        </div>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90">
        This happens at READ COMMITTED because both transactions read the committed value
        (100) before either commits. The database does not know that both transactions
        intend to increment the same counter. Raising the isolation level to SERIALIZABLE
        would prevent it, but at the cost of throughput. The targeted solutions in the
        next section have a much lower performance impact.
      </p>
    </section>
  );
}
