export function SavepointSection() {
  return (
    <section>
      <h2 id="savepoints" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        SAVEPOINTs
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A SAVEPOINT marks a position inside a transaction that you can roll back to without aborting the entire transaction. Changes made before the savepoint are preserved. Changes made after it are undone.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        This is useful when you want to attempt something risky inside a larger transaction — a speculative insert or an optional step — and undo only that part if it fails, without losing everything else.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`BEGIN;

INSERT INTO orders (user_id, amount) VALUES (1, 250);  -- step 1

SAVEPOINT after_order;  -- mark this position

INSERT INTO audit_log (event) VALUES ('order_created');  -- step 2

-- If step 2 fails, roll back to the savepoint
-- Step 1 is still in effect; only step 2 is undone
ROLLBACK TO SAVEPOINT after_order;

-- Continue without the audit log insert
COMMIT;  -- step 1 commits, step 2 did not happen`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">RELEASE SAVEPOINT</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        RELEASE SAVEPOINT removes a savepoint name from the transaction. It does not commit or roll back anything — it just frees the name. The transaction continues normally. In PostgreSQL, releasing a savepoint also makes it impossible to roll back to it.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`BEGIN;

INSERT INTO orders (user_id, amount) VALUES (1, 250);
SAVEPOINT sp1;

UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 42;
SAVEPOINT sp2;

-- Something fails here
DELETE FROM cart WHERE user_id = 1;

-- Only undo the DELETE, keep the UPDATE and INSERT
ROLLBACK TO SAVEPOINT sp2;
RELEASE SAVEPOINT sp2;  -- clean up the name

-- Or undo both the UPDATE and DELETE, keep only the INSERT
-- ROLLBACK TO SAVEPOINT sp1;

COMMIT;`}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "Savepoints nest inside transactions", desc: "A savepoint is not a transaction. You cannot COMMIT to a savepoint — only ROLLBACK TO it. The outer transaction still needs an explicit COMMIT to persist." },
          { label: "Multiple savepoints are allowed", desc: "You can create as many savepoints as you need within one transaction. Rolling back to an earlier savepoint removes any savepoints created after it." },
          { label: "ORMs use savepoints for nested transactions", desc: "Frameworks like Django and Rails use SAVEPOINTs to simulate nested transactions. Calling transaction() inside another transaction creates a savepoint, not a new transaction." },
          { label: "Not all databases support them equally", desc: "PostgreSQL and MySQL (InnoDB) support SAVEPOINTs fully. SQLite supports them. Older or embedded databases may not." },
        ].map(({ label, desc }) => (
          <div key={label} className="p-3 bg-card border border-border rounded-xl">
            <p className="text-[12px] font-semibold mb-1">{label}</p>
            <p className="text-[11px] text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
