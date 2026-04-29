const CDN_YES = [
  { item: "Static assets with content-hash filenames", why: "Immutable — cache forever. app.a3f9c.js never changes." },
  { item: "Images and video (processed or original)", why: "Large payloads benefit most from geo-proximity. CDNs do on-the-fly resizing and WebP conversion." },
  { item: "Fonts", why: "Loaded on every page. Small files, high frequency. Cache once per PoP, serve forever." },
  { item: "Publicly-cacheable API responses", why: "Product listings, exchange rates, public feeds. Short TTL + stale-while-revalidate works well." },
  { item: "Open Graph images and social previews", why: "Crawled frequently by bots. Expensive to regenerate. Cache with a moderate TTL." },
  { item: "Software downloads and large binaries", why: "CDN offloads the bandwidth cost from your origin. Parallel range requests speed up large downloads." },
];

const CDN_NO = [
  { item: "Authenticated API responses", why: "Cache-Control: private must be honored. Serving user A's data to user B is a security incident." },
  { item: "Session-specific HTML (e.g., /dashboard)", why: "Personalized content varies per user. Cannot be shared across users at a CDN edge." },
  { item: "Responses that vary by cookie or request header without Vary header", why: "Without Vary: Cookie, the CDN serves the first cached variant to all users." },
  { item: "Webhooks and inbound event endpoints", why: "POST endpoints that write data cannot be cached. CDNs terminate TLS but must pass through." },
  { item: "Real-time data (WebSocket, SSE streams)", why: "CDNs do not cache streaming connections. Use them for TLS termination only on these paths." },
];

const SECURITY_HEADERS = [
  { header: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload", desc: "Force HTTPS for 2 years. Prevents protocol downgrade attacks." },
  { header: "X-Frame-Options", value: "DENY", desc: "Prevent embedding in iframes — blocks clickjacking." },
  { header: "X-Content-Type-Options", value: "nosniff", desc: "Prevent MIME-type sniffing. Browser uses declared Content-Type." },
  { header: "Content-Security-Policy", value: "default-src 'self'; ...", desc: "Define trusted content sources. Most important but complex to configure correctly." },
  { header: "Permissions-Policy", value: "camera=(), microphone=()", desc: "Disable browser features not used by your app." },
];

export function WhatToServeSection() {
  return (
    <section>
      <h2 id="what-to-serve" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        What to Put on a CDN
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Not everything belongs on a CDN. The rule is: if the response is the same for
        every user who requests it, and it is safe to store at a shared cache, it belongs
        on a CDN. If it is personalized, authenticated, or written by the request, it does not.
        Misconfiguring cache headers on authenticated content is a security vulnerability,
        not a performance problem.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8 not-prose">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-primary/5">
            <p className="text-[10px] font-semibold text-primary">Cache on CDN</p>
          </div>
          <div className="divide-y divide-border/50">
            {CDN_YES.map(({ item, why }) => (
              <div key={item} className="px-4 py-2.5">
                <p className="text-[11px] font-medium mb-0.5">{item}</p>
                <p className="text-[10px] text-muted-foreground">{why}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-destructive/5">
            <p className="text-[10px] font-semibold text-destructive">Do NOT cache on CDN</p>
          </div>
          <div className="divide-y divide-border/50">
            {CDN_NO.map(({ item, why }) => (
              <div key={item} className="px-4 py-2.5">
                <p className="text-[11px] font-medium mb-0.5">{item}</p>
                <p className="text-[10px] text-muted-foreground">{why}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Security headers via CDN</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        CDNs are the right place to inject security response headers globally. A single
        transform rule (Cloudflare Transform Rules, CloudFront Response Headers Policy)
        adds headers to every response from every origin without any application code change.
        This ensures headers are applied even on error pages, redirects, and third-party origin responses.
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Header</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Example value</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {SECURITY_HEADERS.map(({ header, value, desc }) => (
              <tr key={header}>
                <td className="py-2 pr-4 font-mono text-[10px] text-primary align-top">{header}</td>
                <td className="py-2 pr-4 font-mono text-[9px] text-muted-foreground align-top">{value}</td>
                <td className="py-2 text-muted-foreground align-top">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The Vary header</h3>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose space-y-3">
        <p className="text-[11px] text-muted-foreground">
          The Vary header tells the CDN that the response differs based on specific request
          headers. Without Vary, the CDN caches one response and serves it to all users.
          With Vary, it maintains separate cache entries per header value combination.
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# Response varies by Accept-Encoding (gzip vs br vs none)
Vary: Accept-Encoding

# Response varies by language — CDN caches one version per Accept-Language
Vary: Accept-Language

# DANGER: Vary: Cookie creates a separate cache entry per cookie value
# Effectively disables CDN caching for that resource
# Avoid on public resources
Vary: Cookie`}
        </pre>
      </div>
    </section>
  );
}
