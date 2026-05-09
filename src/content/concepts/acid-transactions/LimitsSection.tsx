export function LimitsSection() {
  return (
    <section>
      <h2 id="limits" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        What Transactions Do Not Protect
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Transactions are powerful, but they operate within a specific boundary: a single
        database, within a single transaction, within the isolation level you chose. Every
        scenario that crosses those boundaries requires additional coordination.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Logical correctness</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A transaction guarantees that all its writes commit atomically. It does not
        guarantee that those writes are correct. If the application code computes the
        wrong value, ACID faithfully commits the wrong value.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`async with db.transaction():
    account = await db.fetchrow("SELECT balance FROM accounts WHERE id = $1", account_id)

    # Bug: should be >=, not >
    # ACID commits this incorrect check atomically and durably.
    if account["balance"] > amount:
        await db.execute(
            "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
            amount, account_id
        )
        # Balance is now negative. Transaction committed successfully.`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Cross-service operations</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A database transaction only covers operations within that database. If a workflow
        writes to a database and then calls an external service, those two actions cannot
        be in the same transaction. If the external call fails after the database write
        commits, there is no automatic rollback.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            scenario: "Database write + HTTP call",
            problem: "Order is saved to the database. Payment service call fails. Order exists without a charge.",
            approach: "Design for at-least-once: retry the payment. Use an idempotency key so retrying the charge does not double-charge. Accept temporary inconsistency between systems.",
          },
          {
            scenario: "Two database writes (different DBs)",
            problem: "User created in users DB. Notification created in notifications DB. One succeeds, one fails. No shared transaction spans both.",
            approach: "Use the outbox pattern: write both the entity and a pending event to the same database in one transaction. A separate worker delivers the event to the second system.",
          },
          {
            scenario: "Database write + message queue publish",
            problem: "Order saved to database. Message published to queue. Process crashes between the two. Order exists but no message was sent.",
            approach: "Transactional outbox: write the message to a messages table in the same transaction as the order. A poller reads the table and publishes, then marks the message sent.",
          },
        ].map(({ scenario, problem, approach }) => (
          <div key={scenario} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[11px] font-semibold">{scenario}</p>
            </div>
            <div className="px-4 py-3 space-y-1.5 text-[11px]">
              <p><span className="font-medium text-destructive">Problem: </span><span className="text-muted-foreground">{problem}</span></p>
              <p><span className="font-medium text-primary">Approach: </span><span className="text-muted-foreground">{approach}</span></p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Long-running transactions</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A transaction holds locks for its duration. A long transaction holds locks for
        a long time. Other transactions that need those rows must wait. In PostgreSQL,
        a long-running transaction also prevents VACUUM from reclaiming dead rows,
        causing table bloat.
      </p>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {[
          { problem: "Lock contention", desc: "Other writes to the same rows block until the long transaction commits or rolls back." },
          { problem: "Replication lag", desc: "In some configurations, replicas cannot advance past the oldest active transaction on the primary." },
          { problem: "Table bloat", desc: "PostgreSQL VACUUM cannot reclaim rows that are still visible to an open transaction, even if they were updated long ago." },
        ].map(({ problem, desc }) => (
          <div key={problem} className="p-3 bg-card border border-border rounded-xl">
            <p className="text-[12px] font-semibold text-destructive mb-1">{problem}</p>
            <p className="text-[11px] text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
