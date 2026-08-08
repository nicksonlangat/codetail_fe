import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CORSMisconfigurationSection() {
  return (
    <section>
      <h2 id="cors-misconfiguration" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        CORS: the setting that can quietly undo your CSRF defenses
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The CSRF article in this series mentioned that a JSON API gets partial protection almost
        for free, a plain HTML form can&apos;t set{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Content-Type: application/json</code>{" "}
        on its own, and cross-origin JavaScript that tries to needs your server&apos;s permission
        via CORS. This section is the part where that permission gets handed out too freely.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A CORS middleware that looks permissive on purpose, for convenience
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Browsers reject a literal{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          Access-Control-Allow-Origin: *
        </code>{" "}
        when credentials are involved, which is exactly why this code doesn&apos;t send a literal
        wildcard. It reflects back whatever{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Origin</code>{" "}
        header the request happened to send, satisfying the letter of that rule while granting
        every origin on the internet the same access a wildcard would have. Paired with{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          Access-Control-Allow-Credentials: true
        </code>
        , this means{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">evil.example</code>{" "}
        can make an authenticated fetch to your API, with the victim&apos;s cookies attached, and
        actually read the JSON response back. CSRF at least required guessing blind. This lets the
        attacker see the data.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: an explicit allowlist, not a reflection
        </p>
        <CodeBlock
          variant="fixed"
          code={`ALLOWED_ORIGINS = {"https://app.example", "https://admin.example"}

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Now the origin has to match something on a list you control, not something the request
        supplied. If your API genuinely needs to be called from arbitrary origins, that&apos;s a
        real, valid use case, just don&apos;t pair it with credentials. A public, unauthenticated
        endpoint can reasonably allow any origin. One that reads a session cookie should never
        allow more origins than you can actually name.
      </p>
    </section>
  );
}
