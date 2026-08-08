import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ParameterizedQueriesSection() {
  return (
    <section>
      <h2 id="parameterized-queries" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Parameterized queries, the actual fix
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The fix is not cleverer escaping. It&apos;s removing the string-concatenation step
        entirely. A parameterized query sends the query&apos;s shape and its data down two
        separate channels: the driver compiles the placeholders into a fixed structure first, and
        only afterward drops your values into those slots, as inert data, never as code.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The same login check, fixed
        </p>
        <CodeBlock
          variant="fixed"
          code={`def get_user(username, password):
    query = "SELECT * FROM users WHERE username = %s AND password = %s"
    return db.execute(query, (username, password))`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Submit{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">admin&apos; --</code>{" "}
        as the username through this version and the database looks for a user literally named{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">admin&apos; --</code>.
        Nobody by that name exists, so you get nothing back. Same as any other username that
        isn&apos;t in the table.
      </p>

      <div className="bg-white border border-brand-border rounded-xl overflow-hidden mb-6">
        <div className="bg-brand-surface/30 px-4 py-2.5 border-b border-brand-border">
          <p className="text-[12px] font-medium text-brand-text">
            The claim: &quot;Just escape the quotes in user input&quot;
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[13px] text-brand-text-muted leading-relaxed">
            The reality: escaping is exactly what parameterized queries already do for you, using
            the exact rules for whatever database and driver you&apos;re on. Writing your own
            means getting every edge case right yourself, for every database you support, and it
            still doesn&apos;t help once that carefully escaped string gets read back out and
            dropped into a second query, a report, or a log line that doesn&apos;t re-escape it.
            Use the driver&apos;s parameter binding. It already solved this, years ago.
          </p>
        </div>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        This is a library feature, not a technique you implement
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Every mainstream driver has it: <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">psycopg2</code>,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">mysqlclient</code>,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">node-postgres</code>, JDBC&apos;s{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">PreparedStatement</code>.
        If you catch yourself formatting a value straight into a query string, you haven&apos;t
        hit a missing feature. You skipped the one the library actually wanted you to use.
      </p>
    </section>
  );
}
