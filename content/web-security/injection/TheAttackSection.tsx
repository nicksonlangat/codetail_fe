import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TheAttackSection() {
  return (
    <section>
      <h2 id="the-attack" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The query that isn&apos;t just a query
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Most explanations of SQL injection start with &quot;never trust user input.&quot; Fine
        advice, and it doesn&apos;t actually tell you what trusting it would mean. Here&apos;s the
        mechanism underneath it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A SQL query is a script your database runs exactly as written. Build that script by
        gluing a string together, and whoever controls part of the string controls part of the
        script. There&apos;s no flag on the data saying &quot;this came from a user, watch it.&quot;
        As far as the database is concerned, it&apos;s all just query, start to finish.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A login check, written the way it looks in a thousand tutorials
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`def get_user(username, password):
    query = (
        "SELECT * FROM users WHERE username = '"
        + username + "' AND password = '" + password + "'"
    )
    return db.execute(query)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That code passes every test you&apos;d think to write for it. It also happens to work if
        someone sends{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">admin&apos; --</code>{" "}
        as the username and leaves the password field blank.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The string that actually reaches the database
        </p>
        <CodeBlock
          variant="vulnerable"
          language="SQL"
          code={`SELECT * FROM users WHERE username = 'admin' --' AND password = 'anything'`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">--</code>{" "}
        opens a SQL comment. Everything after it, password check included, gets thrown away
        before the database even looks at it. What actually runs just says: find the user named
        admin. So it logs you in as admin, not because a password got guessed or cracked, but
        because the code that was supposed to check one never ran.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          This is the shape of almost every injection bug you&apos;ll ever debug: data and
          instructions sharing one channel, with nothing on the receiving end able to tell them
          apart. SQL just happens to be where it got famous first.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">admin&apos; --</code>{" "}
        is not a clever payload. It&apos;s the first thing any pentester tries, it&apos;s in every
        intro security course, and it still works against production apps today, because
        &quot;build the query with an f-string&quot; is a natural thing to write and nothing
        about it looks wrong until you know what to look for.
      </p>
    </section>
  );
}
