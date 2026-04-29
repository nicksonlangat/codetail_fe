const EDGE_USE_CASES = [
  {
    useCase: "Authentication and authorization",
    detail: "Verify JWTs at the edge before the request reaches the origin. Reject unauthenticated requests in ~5ms without loading the origin server. Redirect unauthenticated users to login.",
    platforms: "Cloudflare Workers, Lambda@Edge, Vercel Edge Middleware",
  },
  {
    useCase: "A/B testing and feature flags",
    detail: "Assign users to experiment buckets at the edge. Rewrite the URL or modify the response to serve variant A or B. Zero origin round trips for the routing decision.",
    platforms: "Cloudflare Workers, Fastly Compute@Edge",
  },
  {
    useCase: "Geo-based routing and redirects",
    detail: "Inspect the CDN-provided country/region header (CF-IPCountry, CloudFront-Viewer-Country). Redirect EU users to the EU data residency endpoint. Block access from sanctioned regions.",
    platforms: "All major CDNs — geo headers available natively",
  },
  {
    useCase: "Bot detection and rate limiting",
    detail: "Fingerprint requests at the edge before they reach the origin. Check IP reputation, header patterns, and request rates. Return 429 or serve a challenge page without touching the origin.",
    platforms: "Cloudflare Bot Management, AWS WAF (CloudFront integrated)",
  },
  {
    useCase: "Response transformation",
    detail: "Inject headers, modify HTML, add security headers (CSP, HSTS, X-Frame-Options), resize images on the fly. Transform once at the edge for all PoPs simultaneously.",
    platforms: "Cloudflare Workers, Lambda@Edge (response), Fastly VCL",
  },
  {
    useCase: "SSR / ISR at the edge",
    detail: "Render pages at the edge PoP closest to the user using edge-compatible JS runtimes (V8 isolates). Vercel Edge Runtime, Next.js middleware, Cloudflare Pages all support this.",
    platforms: "Vercel Edge Functions, Cloudflare Pages, Deno Deploy",
  },
];

const EDGE_CONSTRAINTS = [
  {
    constraint: "No Node.js APIs",
    detail: "Edge runtimes run in V8 isolates, not Node.js. The fs, net, and child_process modules are unavailable. Use the Web Platform APIs (fetch, crypto, ReadableStream) instead.",
  },
  {
    constraint: "Cold start is near-zero, but CPU is limited",
    detail: "Isolates start in under 1ms (no container spin-up). But CPU time per invocation is capped (typically 50ms on Cloudflare Workers). Long-running computations do not belong at the edge.",
  },
  {
    constraint: "No persistent state (without bindings)",
    detail: "Edge workers are stateless by default. Use KV (eventually consistent), Durable Objects (strongly consistent, but expensive), or D1/Hyperdrive for state that must persist.",
  },
  {
    constraint: "Global deployment only",
    detail: "Edge workers deploy to all PoPs simultaneously. You cannot deploy to a single region. Rollouts require feature flags in the code, not selective deployment.",
  },
];

export function EdgeComputingSection() {
  return (
    <section>
      <h2 id="edge-computing" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Edge Computing: Logic at the PoP
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A CDN PoP was historically a passive cache: it either served a cached response or
        fetched from the origin. Modern CDNs now allow deploying executable code at every
        PoP. Cloudflare Workers, AWS Lambda@Edge, and Fastly Compute@Edge run JavaScript
        or WebAssembly inside the CDN's edge infrastructure, milliseconds from the user.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The model is fundamentally different from serverless functions running in a single
        region. Edge workers run in V8 isolates (not containers), which start in under a
        millisecond. They execute at the PoP nearest to the user, so a user in Tokyo runs
        their request through Tokyo infrastructure rather than waiting for us-east-1.
        The trade-off is a constrained execution environment — no Node.js APIs, limited CPU
        time, and no persistent state without external bindings.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">What to do at the edge</h3>

      <div className="space-y-2 mb-8">
        {EDGE_USE_CASES.map(({ useCase, detail, platforms }) => (
          <div key={useCase} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{useCase}</span>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              <p className="text-[11px] text-muted-foreground">{detail}</p>
              <p className="text-[10px]">
                <span className="font-medium text-foreground/60">Platforms: </span>
                <span className="font-mono text-muted-foreground/70">{platforms}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Edge runtime constraints</h3>

      <div className="space-y-2 mb-6">
        {EDGE_CONSTRAINTS.map(({ constraint, detail }) => (
          <div key={constraint} className="flex gap-3 p-3 rounded-xl border border-orange-400/20 bg-orange-400/5">
            <span className="text-orange-500 text-sm flex-shrink-0 mt-0.5 font-bold">!</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{constraint}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Cloudflare Worker — JWT verification at the edge
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // Public routes bypass auth check
    if (url.pathname.startsWith("/public/")) {
      return fetch(request);
    }

    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = auth.slice(7);
    const valid = await verifyJWT(token, env.JWT_PUBLIC_KEY);
    if (!valid) {
      return new Response("Forbidden", { status: 403 });
    }

    // Forward to origin with verified identity header
    const proxied = new Request(request);
    proxied.headers.set("X-User-Id", valid.sub);
    return fetch(proxied);
  }
}`}
        </pre>
      </div>
    </section>
  );
}
