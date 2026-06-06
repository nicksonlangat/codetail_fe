export function ColumnConstraintsSection() {
  return (
    <section>
      <h2 id="column-constraints" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Column Constraints
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Constraints are rules the database enforces on every write. They run at the boundary — INSERT, UPDATE, DELETE — so invalid data never enters the table regardless of which application or query wrote it.
      </p>

      <div className="space-y-3 mb-8">
        {[
          {
            label: "NOT NULL",
            detail: "value must be present",
            desc: "Rejects any INSERT or UPDATE that leaves the column as NULL. Without NOT NULL, any column accepts NULL by default. Add it to every column that must always have a value.",
          },
          {
            label: "UNIQUE",
            detail: "no two rows share the same value",
            desc: "Rejects an INSERT or UPDATE if the value already exists in the column. NULL is treated specially: most databases allow multiple NULL values in a UNIQUE column because NULL != NULL.",
          },
          {
            label: "CHECK",
            detail: "value must satisfy an expression",
            desc: "Rejects a row if the expression evaluates to FALSE. A CHECK constraint can reference any column in the same row. It passes when the expression is TRUE or UNKNOWN (NULL).",
          },
          {
            label: "PRIMARY KEY",
            detail: "unique, not null identifier for every row",
            desc: "A PRIMARY KEY is shorthand for UNIQUE + NOT NULL. A table can have at most one primary key. The database automatically creates an index on the primary key columns.",
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
{`CREATE TABLE products (
  id          SERIAL        PRIMARY KEY,               -- UNIQUE + NOT NULL
  sku         VARCHAR(50)   NOT NULL UNIQUE,           -- must exist, must be unique
  name        VARCHAR(255)  NOT NULL,
  price       NUMERIC(10,2) NOT NULL CHECK (price > 0),  -- must be positive
  stock       INTEGER       NOT NULL DEFAULT 0
                            CHECK (stock >= 0),        -- cannot go negative
  category    VARCHAR(50)   CHECK (category IN ('electronics', 'clothing', 'food'))
);`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Named constraints</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Naming a constraint with CONSTRAINT makes error messages readable and lets you drop or modify the constraint by name later. Without a name, the database generates one automatically — usually something like <code>products_price_check</code>.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  amount     NUMERIC(10,2) NOT NULL,
  status     VARCHAR(20)   NOT NULL,

  CONSTRAINT orders_amount_positive CHECK (amount > 0),
  CONSTRAINT orders_status_valid    CHECK (status IN ('pending', 'completed', 'cancelled'))
);

-- Drop a named constraint
ALTER TABLE orders DROP CONSTRAINT orders_status_valid;

-- Add a constraint after the fact
ALTER TABLE orders ADD CONSTRAINT orders_amount_positive CHECK (amount > 0);`}
        </pre>
      </div>
    </section>
  );
}
