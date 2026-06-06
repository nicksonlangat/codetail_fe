export function ForeignKeySection() {
  return (
    <section>
      <h2 id="foreign-keys" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Foreign Keys
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A foreign key enforces a relationship between two tables. It says: every value in this column must exist as a primary key (or unique key) in another table. Any insert or update that would create an orphaned reference is rejected.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`CREATE TABLE orders (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount  NUMERIC(10,2) NOT NULL
);

-- Long form, equivalent
CREATE TABLE orders (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  amount  NUMERIC(10,2) NOT NULL,

  CONSTRAINT orders_user_fk FOREIGN KEY (user_id) REFERENCES users(id)
);

-- This INSERT fails if user_id 999 does not exist in users
INSERT INTO orders (user_id, amount) VALUES (999, 100.00);
-- ERROR: insert or update on table "orders" violates foreign key constraint`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">ON DELETE and ON UPDATE actions</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When a referenced row is deleted or updated, the database must decide what to do with rows that reference it. You configure this with ON DELETE and ON UPDATE.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "RESTRICT / NO ACTION",
            detail: "default — block the delete",
            desc: "Prevents deleting a referenced row. If any order references user 5, DELETE FROM users WHERE id = 5 fails. RESTRICT checks immediately; NO ACTION checks at the end of the statement (relevant for deferrable constraints).",
          },
          {
            label: "CASCADE",
            detail: "delete children when parent is deleted",
            desc: "Automatically deletes all referencing rows when the parent is deleted. DELETE FROM users WHERE id = 5 also deletes all their orders. Use carefully — cascades can delete far more than intended.",
          },
          {
            label: "SET NULL",
            detail: "set the foreign key to NULL",
            desc: "Sets the foreign key column to NULL when the referenced row is deleted. The child row is preserved but loses its reference. Only works if the foreign key column allows NULL.",
          },
          {
            label: "SET DEFAULT",
            detail: "set the foreign key to its default value",
            desc: "Sets the foreign key column to its DEFAULT value when the referenced row is deleted. Rarely used — the default value must itself be a valid foreign key or NULL.",
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

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`CREATE TABLE orders (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  -- user deleted -> order preserved with NULL user_id

  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  -- product deletion blocked if any order references it

  coupon_id INTEGER REFERENCES coupons(id) ON DELETE CASCADE
  -- coupon deleted -> all orders using it are also deleted
);`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Always index foreign key columns. The database checks the foreign key on every INSERT and UPDATE to the child table, and on every DELETE or UPDATE to the parent table. Without an index on the foreign key column, these checks require a sequential scan.
      </p>
    </section>
  );
}
