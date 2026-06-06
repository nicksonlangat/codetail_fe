export function SelectStatementSection() {
  return (
    <section>
      <h2 id="select-statement" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        The SELECT Statement
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        SELECT reads rows from a table and returns the columns you specify. It does not modify data. It just returns a result set.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The simplest form uses <code>*</code> to return every column. Listing column names instead limits the output to only those columns. The order you list them determines the order they appear in results.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Column selection and aliases</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The AS keyword renames a column in the result set. This is called an alias. The alias only exists in the output — it does not change anything in the table.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        DISTINCT removes duplicate values. It applies to the entire row, not just one column. If you select two columns, a row is only removed if both column values are identical to another row.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`-- Return all columns, all rows
SELECT * FROM users;

-- Return only specific columns
SELECT id, email, created_at FROM users;

-- Rename a column in the result
SELECT email AS user_email FROM users;

-- Remove duplicate values
SELECT DISTINCT country FROM users;`}
        </pre>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "SELECT *", desc: "Returns all columns from the table. Convenient for exploration, but listing columns explicitly is better in production queries." },
          { label: "SELECT columns", desc: "Returns only the listed columns. Reduces data transferred and makes queries easier to read." },
          { label: "SELECT col AS alias", desc: "Renames the column in the output. Useful when column names are unclear or when expressions need a readable label." },
          { label: "SELECT DISTINCT", desc: "Removes duplicate rows from the result. Two rows are duplicates only if all selected columns match." },
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
