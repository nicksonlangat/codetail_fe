export function HowJoinsWorkSection() {
  return (
    <section>
      <h2 id="how-joins-work" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        How a JOIN Works
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A JOIN combines rows from two tables based on a condition. For every row in the first table, SQL checks every row in the second table and keeps pairs where the condition is true.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The ON clause defines that condition. It is almost always an equality between a foreign key in one table and the primary key in the other. But it can be any expression that evaluates to true or false.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- orders has a user_id column pointing to users.id
SELECT orders.id, orders.amount, users.email
FROM orders
JOIN users ON orders.user_id = users.id;`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        This query reads: for each order, find the user whose id matches the order's user_id, then return the order id, amount, and that user's email in a single row.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Table aliases</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When both tables have a column with the same name, you need to qualify it with the table name. Aliases shorten this.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Without aliases: verbose
SELECT orders.id, orders.amount, users.email
FROM orders
JOIN users ON orders.user_id = users.id;

-- With aliases: cleaner
SELECT o.id, o.amount, u.email
FROM orders o
JOIN users u ON o.user_id = u.id;`}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "ON clause", desc: "Defines which rows to match. Usually a foreign key equals a primary key. Rows where the condition is false are not included in the result." },
          { label: "Table aliases", desc: "A shorthand name for a table in the query. Defined after the table name with or without AS. Required when the same table appears twice." },
          { label: "Ambiguous columns", desc: "If two tables share a column name, you must qualify it: table.column or alias.column. Forgetting this causes an error." },
          { label: "Result row structure", desc: "Each result row contains columns from both tables joined together. You choose which columns to include in SELECT." },
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
