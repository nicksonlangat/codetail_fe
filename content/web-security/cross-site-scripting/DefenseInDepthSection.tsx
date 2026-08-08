import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DefenseInDepthSection() {
  return (
    <section>
      <h2 id="defense-in-depth" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Output encoding, CSP, and HttpOnly cookies
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Escaping isn&apos;t one universal function you call and forget about. The correct
        escaping depends on where the value actually lands. A value dropped into the body of the
        page needs{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{"< > & \" '"}</code>{" "}
        escaped. A value dropped inside an HTML attribute, inside a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{"<script>"}</code>{" "}
        block, or inside a URL each need different rules, and using the HTML-body rules in one of
        those other contexts can reopen the exact hole you thought you&apos;d closed. A real
        templating engine tracks the context for you. Hand-rolled string building generally
        doesn&apos;t, which is one more reason to prefer the framework&apos;s default over writing
        your own.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Content Security Policy: a backstop for when escaping fails
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Escaping is the primary defense. CSP is what catches it when escaping fails somewhere you
        didn&apos;t expect.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A response header
        </p>
        <CodeBlock
          language="HTTP"
          code={`Content-Security-Policy: default-src 'self'; script-src 'self'`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This tells the browser, not your server, to refuse to run inline{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{"<script>"}</code>{" "}
        tags and to refuse to load scripts from any origin other than your own. If a payload does
        slip past your escaping and lands in the page, the browser that renders it simply
        won&apos;t execute it. It&apos;s not a substitute for fixing the escaping bug, it&apos;s
        insurance for the one you haven&apos;t found yet.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        HttpOnly cookies: limiting what a successful XSS can actually take
      </h3>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A session cookie, set correctly
        </p>
        <CodeBlock
          language="HTTP"
          code={`Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">HttpOnly</code>{" "}
        means{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">document.cookie</code>{" "}
        can&apos;t read this cookie from JavaScript at all, not even from a script an attacker
        successfully injected. It doesn&apos;t stop the XSS from running. A payload can still deface
        the page, log keystrokes on a form, or send requests as the logged-in user through the
        browser&apos;s own session. What it can&apos;t do is grab the session token and hand it
        straight to a server the attacker controls, which is the single most common thing an XSS
        payload is written to do. Every layer here is doing a different job: escaping stops the
        injection, CSP stops what escaping misses, HttpOnly limits the payoff when both of those
        somehow fail at once.
      </p>
    </section>
  );
}
