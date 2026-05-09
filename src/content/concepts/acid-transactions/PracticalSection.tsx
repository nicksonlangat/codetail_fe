export function PracticalSection() {
  return (
    <section>
      <h2 id="practical" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Using Transactions Correctly
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Transactions are the right tool for a specific job: multiple writes to the same
        database that must succeed or fail together. Used correctly, they simplify error
        handling and eliminate partial-write bugs. Used incorrectly, they cause lock
        contention, timeout cascades, and distributed consistency problems.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Rules for production transactions</h3>

      <div className="space-y-2 mb-8">
        {[
          {
            rule: "Keep transactions short",
            detail: "Open a transaction, do the writes, commit. Do not perform computation, call services, wait for user input, or sleep inside a transaction. Every millisecond the transaction is open, locks are held.",
          },
          {
            rule: "Never call external services inside a transaction",
            detail: "An HTTP call inside a transaction locks rows for the duration of the network round-trip (100ms to several seconds). If the call hangs, rows are locked indefinitely. Move external calls outside the transaction boundary.",
          },
          {
            rule: "Handle errors and roll back explicitly",
            detail: "Do not assume a failed query automatically rolls back the transaction. Use a try/except block and call ROLLBACK explicitly on failure. In Python, use async context managers that roll back on exception.",
          },
          {
            rule: "Do not hold transactions open across user interactions",
            detail: "A 'shopping cart checkout' flow that opens a transaction at step 1 and commits at step 3 holds locks for the duration of the user's multi-page flow. Use application-level locking or optimistic concurrency instead.",
          },
          {
            rule: "Use savepoints for partial rollback",
            detail: "SAVEPOINT allows rolling back part of a transaction without discarding all of it. Useful for retrying a sub-operation that may fail without abandoning the whole workflow.",
          },
        ].map(({ rule, detail }) => (
          <div key={rule} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{rule}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The correct pattern</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# Correct: short transaction, no external calls inside
async def transfer(from_id: str, to_id: str, amount: int):
    # Validate outside the transaction
    if amount <= 0:
        raise ValueError("Amount must be positive")

    async with db.transaction():
        # All reads and writes inside the transaction
        sender = await db.fetchrow(
            "SELECT balance FROM accounts WHERE id = $1 FOR UPDATE", from_id
        )
        if sender["balance"] < amount:
            raise ValueError("Insufficient funds")

        await db.execute(
            "UPDATE accounts SET balance = balance - $1 WHERE id = $2", amount, from_id
        )
        await db.execute(
            "UPDATE accounts SET balance = balance + $1 WHERE id = $2", amount, to_id
        )
        # Transaction commits here. Both updates are atomic and durable.

    # External calls happen AFTER the transaction commits
    await notify_user(from_id, f"Sent {amount}")`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">When transactions are not enough: the Saga pattern</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        For workflows that span multiple services or databases, a single transaction is
        not available. The Saga pattern breaks the workflow into a sequence of local
        transactions, each with a compensating action that undoes its effect if a
        later step fails.
      </p>

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-2.5 border-b border-border bg-muted/30">
          <p className="text-[11px] font-semibold">Order saga: place order, reserve inventory, charge payment</p>
        </div>
        <div className="px-4 py-4 space-y-2">
          {[
            { step: "1", text: "Create order (orders DB). Compensating action: cancel order.", bad: false },
            { step: "2", text: "Reserve inventory (inventory service). Compensating action: release reservation.", bad: false },
            { step: "3", text: "Charge payment (payment service). If this fails:", bad: false },
            { step: "↩", text: "Run compensation: release inventory reservation.", bad: true },
            { step: "↩", text: "Run compensation: cancel the order.", bad: true },
          ].map(({ step, text, bad }, i) => (
            <div key={i} className="flex gap-3 text-[11px]">
              <span className={`w-5 h-5 rounded-full text-[9px] font-bold flex-shrink-0 flex items-center justify-center ${bad ? "bg-orange-500/10 text-orange-500" : "bg-secondary text-muted-foreground"}`}>
                {step}
              </span>
              <p className={`mt-0.5 ${bad ? "text-orange-500" : "text-muted-foreground"}`}>{text}</p>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-border bg-muted/20">
          <p className="text-[10px] text-muted-foreground">Each step is a separate local transaction. Failures trigger compensating actions rather than a global rollback. The system converges to a consistent state, but may pass through inconsistent intermediate states.</p>
        </div>
      </div>
    </section>
  );
}
