import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DefenseInDepthSection() {
  return (
    <section>
      <h2 id="defense-in-depth" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        ORMs, allowlisting, and least privilege
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        ORMs parameterize the queries they build for you, automatically. They do nothing to stop
        you from building a query yourself, and most of them leave an escape hatch open for
        exactly that.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A Django escape hatch, used the way the vulnerable version from earlier was written
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`User.objects.raw(
    f"SELECT * FROM users WHERE username = '{username}'"
)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">.raw()</code>,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">.extra()</code>, any
        ORM method that accepts a raw string, it&apos;s the same concatenation bug as before, one
        import statement away from the query builder that would have caught it.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The same escape hatch, parameterized correctly
        </p>
        <CodeBlock
          variant="fixed"
          code={`User.objects.raw(
    "SELECT * FROM users WHERE username = %s", [username]
)`}
        />
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Table and column names can&apos;t be parameterized
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Parameterization covers values: things you can swap out without changing what the query
        means. A column or table name changes the query&apos;s actual shape, so no driver will let
        you bind one as a parameter. A &quot;sort by any column&quot; endpoint has to solve this a
        different way, checking the name against a fixed allowlist before it ever touches a query
        string.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Dynamic sorting, done safely
        </p>
        <CodeBlock
          variant="fixed"
          code={`ALLOWED_SORT_COLUMNS = {"created_at", "username", "email"}

def list_users(sort_by):
    if sort_by not in ALLOWED_SORT_COLUMNS:
        raise ValueError("invalid sort column")
    # safe: sort_by can only be one of three hardcoded strings by this point
    query = f"SELECT * FROM users ORDER BY {sort_by}"
    return db.execute(query)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This still builds the query with an f-string, and that&apos;s fine here. By the time it
        runs,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">sort_by</code>{" "}
        has already been checked against three known values. It can&apos;t be attacker-controlled
        text anymore, whatever the request originally sent.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Least privilege as the last line of defense
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Everything above assumes you catch every place this can happen. You won&apos;t, not
        forever, not across every endpoint someone adds two years from now on a Friday afternoon.
        The last layer isn&apos;t in your code at all: the database user your app connects as
        should only hold the permissions it actually needs.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> an application account that can{" "}
          <code className="font-mono text-[12px]">SELECT</code>,{" "}
          <code className="font-mono text-[12px]">INSERT</code>,{" "}
          <code className="font-mono text-[12px]">UPDATE</code>, and{" "}
          <code className="font-mono text-[12px]">DELETE</code> on its own tables, with no{" "}
          <code className="font-mono text-[12px]">DROP</code>, no{" "}
          <code className="font-mono text-[12px]">GRANT</code>, and no reach into other schemas,
          turns a successful injection into a contained mess instead of a total loss. It
          won&apos;t stop the query from running. It just limits what running it can do.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        None of this replaces parameterized queries. It&apos;s what&apos;s left standing when
        parameterization gets missed somewhere, which, on some endpoint, eventually, it will.
      </p>
    </section>
  );
}
