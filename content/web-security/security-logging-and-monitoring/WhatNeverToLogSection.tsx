import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhatNeverToLogSection() {
  return (
    <section>
      <h2 id="what-never-to-log" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Logs are a copy of your data, with fewer safeguards
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Logging too little leaves you blind. Logging too much of the wrong thing creates a second
        copy of your most sensitive data, usually shipped to a third-party log aggregator,
        retained for years by default, and readable by a much larger set of engineers than the
        production database ever is.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A debug log line that felt harmless to add
        </p>
        <CodeBlock variant="vulnerable" code={`log.info(f"Login attempt: {request.form}")`} />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">request.form</code>{" "}
        includes the raw password field. It&apos;s now in plaintext, in your logging pipeline,
        wherever that pipeline sends it, for as long as your retention policy keeps it. The same
        habit applied elsewhere puts session tokens, full API keys, and card numbers into a system
        that was never built with the same access controls or encryption as the database those
        values came from.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: an explicit allowlist of fields, never the raw body
        </p>
        <CodeBlock
          variant="fixed"
          code={`log.info("Login attempt", extra={
    "email": request.form.get("email"),
    "outcome": outcome,
})`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Decide what belongs in a log line the same way you&apos;d decide what belongs in an API
        response: name the fields explicitly. Logging the whole request object, the whole response
        body, or the whole exception context is convenient right up until one of those objects
        happens to contain something that should never have left the process it was created in.
      </p>
    </section>
  );
}
