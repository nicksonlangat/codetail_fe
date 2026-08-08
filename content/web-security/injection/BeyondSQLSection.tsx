import { CodeBlock } from "@/components/blog/interactive/code-block";

export function BeyondSQLSection() {
  return (
    <section>
      <h2 id="beyond-sql" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        NoSQL and command injection
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Injection isn&apos;t a SQL problem specifically. It&apos;s what happens when untyped input
        reaches something that interprets structure. MongoDB doesn&apos;t parse SQL, but a
        MongoDB query is a JSON object, and JSON has structure of its own.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">NoSQL injection</h3>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A login check that never touches a string template
        </p>
        <CodeBlock
          variant="vulnerable"
          language="JavaScript"
          code={`// req.body comes straight from the client as parsed JSON
db.users.findOne({
  username: req.body.username,
  password: req.body.password,
});`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        No string concatenation anywhere in sight, and it&apos;s still injectable. Send a JSON
        body where{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">password</code>{" "}
        is <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{`{ "$ne": null }`}</code>{" "}
        instead of a string, and MongoDB doesn&apos;t see a strange password value, it sees a
        query operator: match any password that is not null. True of every account that has a
        password. Which is all of them.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: force the shape before it reaches the query
        </p>
        <CodeBlock
          variant="fixed"
          language="JavaScript"
          code={`const username = String(req.body.username);
const password = String(req.body.password);

// { "$ne": null } becomes the literal string "[object Object]",
// which will never match a real password
db.users.findOne({ username, password });`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Coercing to a string closes this specific hole. It&apos;s a floor, not the fix for the
        underlying problem, which is that nothing validated the request&apos;s shape before it
        reached a query. Add schema validation at the boundary (Zod, Joi, a typed DTO, whatever
        your stack already has) and reject the malformed request with a 400 before your handler
        runs at all.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Command injection</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Same mechanism, one layer down. Instead of a database interpreting your string, the shell
        does.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A network diagnostics endpoint
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`import os

def ping(host):
    os.system(f"ping -c 1 {host}")`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">os.system</code>{" "}
        hands the whole string to a shell, and a shell treats{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">;</code>{" "}
        as &quot;run the next command too.&quot; A host value of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">8.8.8.8; rm -rf /data</code>{" "}
        runs the ping, then deletes a directory. The server did exactly what it was told. It just
        didn&apos;t realize the instruction was two instructions.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: never hand a string to a shell
        </p>
        <CodeBlock
          variant="fixed"
          code={`import subprocess

def ping(host):
    subprocess.run(["ping", "-c", "1", host], check=True)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Pass a list of arguments instead of one string and there&apos;s no shell involved at all.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">subprocess.run</code>{" "}
        delivers <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">host</code>{" "}
        to <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">ping</code>{" "}
        as a single literal argument, semicolon included. Worst case, ping chokes on a bad
        hostname. Nothing gets deleted.
      </p>
    </section>
  );
}
