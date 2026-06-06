export function DeferrableSection() {
  return (
    <section>
      <h2 id="deferrable-constraints" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Deferrable Constraints
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        By default, constraints are checked after every statement. A deferrable constraint can instead be checked at the end of the transaction — at COMMIT time. This lets you temporarily violate a constraint mid-transaction as long as it is satisfied when you commit.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The classic use case is circular foreign keys: table A references table B, and table B references table A. Inserting either row first would violate one of the constraints. Deferring constraint checks lets you insert both rows in the same transaction and satisfy both constraints at commit.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- employees has a manager_id that points to another employee
-- The CEO row has no manager — but until the CEO row exists,
-- you can't insert any row with manager_id pointing to them

CREATE TABLE employees (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  manager_id INTEGER REFERENCES employees(id)
             DEFERRABLE INITIALLY DEFERRED
);

BEGIN;
-- Insert subordinate first (manager doesn't exist yet — normally an error)
INSERT INTO employees (id, name, manager_id) VALUES (2, 'Alice', 1);
-- Insert the manager row
INSERT INTO employees (id, name, manager_id) VALUES (1, 'Bob', NULL);
COMMIT;
-- Constraint checked now — both rows exist, both are valid`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">DEFERRABLE vs INITIALLY DEFERRED</h3>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "NOT DEFERRABLE",
            detail: "default — checked after every statement",
            desc: "The constraint fires immediately after each INSERT, UPDATE, or DELETE. Cannot be changed within a transaction. This is the default for all constraints unless specified otherwise.",
          },
          {
            label: "DEFERRABLE INITIALLY IMMEDIATE",
            detail: "deferrable, but immediate by default",
            desc: "The constraint is checked after each statement by default, but can be switched to deferred mode within a transaction using SET CONSTRAINTS. Flexible without changing default behavior.",
          },
          {
            label: "DEFERRABLE INITIALLY DEFERRED",
            detail: "deferred by default — checked at COMMIT",
            desc: "The constraint is checked at COMMIT by default. Can be switched back to immediate within a transaction. Use this when deferred checking is the normal case for this constraint.",
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

      <h3 className="text-base font-semibold mt-8 mb-3">SET CONSTRAINTS within a transaction</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Switch a specific constraint to deferred for this transaction only
BEGIN;
SET CONSTRAINTS orders_user_fk DEFERRED;

INSERT INTO orders (user_id, amount) VALUES (999, 100);  -- user 999 doesn't exist yet
INSERT INTO users (id, email) VALUES (999, 'new@example.com');

COMMIT;  -- constraint checked now — user 999 exists

-- Defer all deferrable constraints in the transaction
SET CONSTRAINTS ALL DEFERRED;

-- Switch back to immediate (triggers check immediately)
SET CONSTRAINTS ALL IMMEDIATE;`}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "Only PostgreSQL supports deferrable constraints fully", desc: "MySQL does not support DEFERRABLE. SQL Server has limited support. PostgreSQL is the most complete implementation." },
          { label: "Deferred constraints and savepoints", desc: "Rolling back to a SAVEPOINT does not trigger deferred constraint checks. Checks only happen at COMMIT or when SET CONSTRAINTS IMMEDIATE is called." },
          { label: "Unique constraints can be deferrable too", desc: "UNIQUE DEFERRABLE INITIALLY DEFERRED lets you swap two unique values within a transaction without a temporary third value or two statements." },
          { label: "Performance consideration", desc: "Deferring constraints moves work from each statement to COMMIT. If the transaction has many writes, COMMIT may take noticeably longer as all deferred checks run at once." },
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
