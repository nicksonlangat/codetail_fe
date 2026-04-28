const INDEX_TYPES = [
  {
    name: "Single-column index",
    tag: "most common",
    tagColor: "bg-primary/10 text-primary",
    desc: "An index on one column. The most common form. Speeds up equality and range queries on that column.",
    code: `CREATE INDEX idx_users_email ON users(email);

-- Queries that use this index:
WHERE email = 'alice@example.com'    -- equality
WHERE email > 'l@...'               -- range
ORDER BY email                       -- sort`,
    note: "The database may ignore the index if the column has very few distinct values (low cardinality) or if the query returns most of the table.",
  },
  {
    name: "Composite index",
    tag: "leftmost prefix rule",
    tagColor: "bg-orange-400/10 text-orange-500",
    desc: "An index on multiple columns. The order of columns matters critically. The index can be used for queries that filter on the leftmost prefix of the index columns.",
    code: `-- Index on (last_name, first_name, age)
CREATE INDEX idx_name ON users(last_name, first_name, age);

-- Uses the index:
WHERE last_name = 'Smith'
WHERE last_name = 'Smith' AND first_name = 'Alice'
WHERE last_name = 'Smith' AND first_name = 'Alice' AND age > 30

-- Does NOT use the index:
WHERE first_name = 'Alice'  -- skips leftmost column
WHERE age > 30              -- skips two leftmost columns`,
    note: "Put the most selective column (most distinct values) first, unless your most common query always filters on a specific column.",
  },
  {
    name: "Covering index",
    tag: "index-only scan",
    tagColor: "bg-blue-400/10 text-blue-500",
    desc: "An index that includes all columns needed by a query. The database can answer the query entirely from the index, without touching the main table (heap). This is called an index-only scan.",
    code: `-- Query: get name and email for users in a role
SELECT name, email FROM users WHERE role = 'admin';

-- A covering index includes all needed columns
CREATE INDEX idx_role_covering ON users(role, name, email);

-- Now the query never touches the users table:
-- Index has role (for filtering) + name + email (for SELECT)
-- Result: index-only scan, zero heap fetches`,
    note: "Covering indexes use more storage but eliminate the most expensive part of a lookup: the heap fetch. Benchmark before adding them blindly.",
  },
  {
    name: "Partial index",
    tag: "selective rows only",
    tagColor: "bg-purple-400/10 text-purple-500",
    desc: "An index that only covers rows matching a WHERE condition. Smaller than a full index, faster to maintain, and can be more selective for the queries that need it.",
    code: `-- Only index active users (not the 90% who churned)
CREATE INDEX idx_active_users
  ON users(email)
  WHERE status = 'active';

-- Only index unprocessed orders
CREATE INDEX idx_pending_orders
  ON orders(created_at)
  WHERE processed = false;

-- The query must include the same WHERE clause
-- for the database to choose the partial index`,
    note: "Ideal when most of your queries filter on a condition that excludes large portions of the table (soft-deleted rows, inactive records, processed events).",
  },
];

export function IndexTypesSection() {
  return (
    <section>
      <h2 id="index-types" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Index Design: Types and Trade-offs
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Not all indexes are equal. The type of index and how you design it determines
        whether the database can use it for a given query. Understanding these types
        lets you build indexes that are both fast and efficient.
      </p>

      <div className="space-y-4">
        {INDEX_TYPES.map(({ name, tag, tagColor, desc, code, note }) => (
          <div key={name} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 bg-secondary/50 border-b border-border flex items-center gap-2">
              <span className="text-[13px] font-semibold">{name}</span>
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${tagColor}`}>{tag}</span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-[12px] text-muted-foreground leading-relaxed">{desc}</p>
              <pre className="text-[10px] font-mono bg-muted rounded-xl px-3 py-3 overflow-x-auto whitespace-pre leading-relaxed">
                {code}
              </pre>
              <div className="flex gap-2 items-start p-2.5 rounded-lg bg-muted/50">
                <span className="text-[10px] font-bold text-muted-foreground flex-shrink-0 mt-0.5">Note</span>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Composite index column order</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The leftmost prefix rule catches many engineers off-guard. Given an index on
        (A, B, C), the database can use it for queries filtering on A, on A+B, or on A+B+C.
        It cannot use it for queries filtering only on B or only on C.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Index (department, hire_date, salary) — what gets used
        </p>
        <div className="space-y-1.5">
          {[
            { query: "WHERE department = 'Eng'", uses: "Yes", note: "Leftmost prefix only" },
            { query: "WHERE department = 'Eng' AND hire_date > '2023-01-01'", uses: "Yes", note: "First two columns" },
            { query: "WHERE department = 'Eng' AND hire_date > '2023-01-01' AND salary > 80000", uses: "Yes", note: "All three columns" },
            { query: "WHERE hire_date > '2023-01-01'", uses: "No", note: "Skips leftmost column" },
            { query: "WHERE salary > 80000", uses: "No", note: "Skips two leftmost columns" },
            { query: "WHERE department = 'Eng' AND salary > 80000", uses: "Partial", note: "Uses dept only; salary filter is applied after" },
          ].map(({ query, uses, note }) => (
            <div key={query} className="flex items-start gap-3 text-[10px]">
              <span className={`flex-shrink-0 font-mono font-bold w-14 text-right ${
                uses === "Yes" ? "text-primary" : uses === "No" ? "text-destructive" : "text-orange-500"
              }`}>
                {uses}
              </span>
              <code className="font-mono text-foreground/70 flex-1">{query}</code>
              <span className="text-muted-foreground/50 flex-shrink-0 hidden sm:block">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
