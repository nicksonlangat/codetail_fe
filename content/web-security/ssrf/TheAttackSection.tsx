import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TheAttackSection() {
  return (
    <section>
      <h2 id="the-attack" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        You asked the server to fetch a URL. It fetched the wrong one.
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Plenty of ordinary features need the server to fetch a URL somebody else supplied: a link
        preview, an avatar imported from a profile picture URL, a webhook tester, a PDF generator
        that renders a given page. All of them share the same shape, and the same failure mode.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A link preview feature
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`@app.route("/fetch-preview", methods=["POST"])
@login_required
def fetch_preview():
    url = request.form["url"]
    response = requests.get(url, timeout=5)
    return {"content": response.text[:500]}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Nothing about this code cares where{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">url</code>{" "}
        points. It could be a news article, which is the intended use. It could also be{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">http://localhost:6379</code>{" "}
        to probe an internal Redis instance, or{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">http://internal-admin.local/users</code>{" "}
        to reach an internal API that was never meant to face the public internet, and never
        expected to need to defend itself, because it assumed only requests originating from
        inside your own network could ever reach it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        That assumption is exactly what this bug breaks. The request really does originate from
        inside your network, from your own server. The user just gets to pick where it goes, and
        an internal service that trusts &quot;this request came from inside&quot; as its whole
        security model has no way to tell the difference between your app doing its job and your
        app being used as a proxy into somewhere it was never supposed to reach.
      </p>
    </section>
  );
}
