import { CodeBlock } from "@/components/blog/interactive/code-block";

export function VerboseErrorsSection() {
  return (
    <section>
      <h2 id="verbose-errors" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Verbose errors: a stack trace is documentation for an attacker
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Nothing in this article involves an attacker finding a clever bug. Every one of these is a
        setting that was fine in development, correct even, and just never got flipped back before
        the app went live.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A Flask app started the way every tutorial starts it
        </p>
        <CodeBlock variant="vulnerable" code={`app.run(debug=True)`} />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Debug mode is genuinely useful while you&apos;re writing the app: an unhandled exception
        shows a full stack trace, the exact line and variable values that caused it, and in
        Flask&apos;s case an interactive console you can type Python into, right in the browser.
        In production, that same feature hands an attacker your file paths, your framework version,
        the names of internal functions and variables, and sometimes a live code execution console
        sitting behind nothing but a URL.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        None of that requires finding a bug first. An attacker just needs to trigger any unhandled
        exception, an unexpected input type, a missing field, a malformed request, and the app
        does the reconnaissance for them.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: debug tooling stays on developer machines
        </p>
        <CodeBlock
          variant="fixed"
          code={`app.run(debug=os.environ.get("FLASK_ENV") == "development")

@app.errorhandler(500)
def internal_error(e):
    log_exception(e)  # full detail, server-side only
    return {"error": "Something went wrong"}, 500`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The user gets a generic message. The full trace still exists, it goes to your logs or
        error tracker where you can actually use it, instead of to whoever happened to send the
        request that triggered it. Django has a related trap:{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">DEBUG = True</code>{" "}
        with an empty{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">ALLOWED_HOSTS</code>{" "}
        quietly falls back to accepting only localhost, so a team can run the app locally for
        months without ever noticing that{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">ALLOWED_HOSTS</code>{" "}
        was never actually configured for the real production domain. Set both deliberately before
        anything goes live, not just one.
      </p>
    </section>
  );
}
