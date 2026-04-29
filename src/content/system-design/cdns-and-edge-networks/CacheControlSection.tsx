const DIRECTIVES = [
  {
    directive: "max-age=3600",
    scope: "Browser + CDN",
    meaning: "Cache this response for 3600 seconds (1 hour). Both the browser and CDN respect this.",
    example: "Cache-Control: max-age=3600",
  },
  {
    directive: "s-maxage=86400",
    scope: "CDN only",
    meaning: "CDN caches for 86400s (1 day). Browser ignores s-maxage and falls back to max-age. Lets you differentiate CDN TTL from browser TTL.",
    example: "Cache-Control: max-age=3600, s-maxage=86400",
  },
  {
    directive: "no-cache",
    scope: "Browser + CDN",
    meaning: "Do not serve a cached response without revalidating with the origin first (via ETag or Last-Modified). Misleading name — it does NOT mean 'no caching'.",
    example: "Cache-Control: no-cache",
  },
  {
    directive: "no-store",
    scope: "Browser + CDN",
    meaning: "Do not cache at all — ever. For sensitive data: bank statements, PII, session-specific pages. Every request goes to origin.",
    example: "Cache-Control: no-store, private",
  },
  {
    directive: "private",
    scope: "CDN blocked",
    meaning: "Response is specific to one user — CDN must not cache it. Browser may cache. Used for authenticated pages, personalized content.",
    example: "Cache-Control: private, max-age=0",
  },
  {
    directive: "public",
    scope: "Browser + CDN",
    meaning: "Response may be cached by any cache including shared CDN caches, even if the request was authenticated. Explicit permission for CDN caching.",
    example: "Cache-Control: public, max-age=600",
  },
  {
    directive: "stale-while-revalidate=60",
    scope: "Browser + CDN",
    meaning: "Serve stale content for up to 60s while fetching a fresh copy in the background. Zero-latency updates — user never waits for revalidation.",
    example: "Cache-Control: max-age=300, stale-while-revalidate=60",
  },
  {
    directive: "immutable",
    scope: "Browser",
    meaning: "The resource will never change for the duration of max-age. Browser skips revalidation entirely. Use only with content-hashed filenames (app.a3f9c.js).",
    example: "Cache-Control: max-age=31536000, immutable",
  },
];

const ASSET_STRATEGIES = [
  {
    asset: "Versioned static assets (app.a3f9c.js, logo.v2.png)",
    strategy: "Cache-Control: public, max-age=31536000, immutable",
    why: "Content hash in filename = unique URL for each version. Safe to cache forever. Browser and CDN will hold until evicted. Zero revalidation overhead.",
  },
  {
    asset: "HTML pages",
    strategy: "Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=60",
    why: "Browser always revalidates (content changes frequently). CDN caches for 5 min, serves stale while updating. Invalidate CDN on deploy.",
  },
  {
    asset: "API responses (public, slow-changing)",
    strategy: "Cache-Control: public, s-maxage=60, stale-while-revalidate=30",
    why: "CDN caches for 60s, serves stale while revalidating. Reduces origin load for popular endpoints. Do not cache if response varies by user.",
  },
  {
    asset: "Authenticated API responses",
    strategy: "Cache-Control: private, no-store",
    why: "User-specific data must never be served from a shared CDN cache. A shared cache returning user A's data to user B is a security incident.",
  },
  {
    asset: "Fonts and icons (third-party or self-hosted)",
    strategy: "Cache-Control: public, max-age=31536000, immutable",
    why: "Fonts do not change. Cache forever. Use font-display: swap in CSS to handle the first-load cache miss without layout shift.",
  },
];

export function CacheControlSection() {
  return (
    <section>
      <h2 id="cache-control" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Cache-Control: Directing CDN Behavior
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Cache-Control is the HTTP response header that tells browsers and CDNs how to cache
        a response. It is a comma-separated list of directives, each controlling a specific
        aspect of caching behavior. Getting these directives right is the primary lever for
        CDN cache hit rate and performance.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The most important distinction: some directives apply only to shared caches (CDNs)
        via the s- prefix, while others apply to all caches including the browser. This lets
        you cache aggressively at the CDN while controlling what the browser holds locally.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Key directives</h3>

      <div className="space-y-2 mb-8">
        {DIRECTIVES.map(({ directive, scope, meaning, example }) => (
          <div key={directive} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/30">
              <span className="font-mono text-[10px] font-semibold text-primary">{directive}</span>
              <span className={`ml-auto text-[8px] font-mono px-1.5 py-0.5 rounded border ${
                scope === "CDN only"
                  ? "text-orange-500 bg-orange-400/10 border-orange-400/20"
                  : scope === "CDN blocked"
                  ? "text-destructive bg-destructive/10 border-destructive/20"
                  : scope === "Browser"
                  ? "text-blue-500 bg-blue-500/10 border-blue-500/20"
                  : "text-primary bg-primary/10 border-primary/20"
              }`}>
                {scope}
              </span>
            </div>
            <div className="px-4 py-2.5 space-y-1">
              <p className="text-[11px] text-muted-foreground">{meaning}</p>
              <pre className="text-[9px] font-mono text-muted-foreground/70">{example}</pre>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Caching strategies by asset type</h3>

      <div className="space-y-2 mb-8">
        {ASSET_STRATEGIES.map(({ asset, strategy, why }) => (
          <div key={asset} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[10px] font-medium text-foreground/80">{asset}</p>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              <pre className="text-[9px] font-mono text-primary bg-primary/5 border border-primary/10 rounded-lg px-3 py-1.5 overflow-x-auto">
                {strategy}
              </pre>
              <p className="text-[11px] text-muted-foreground">{why}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Cache invalidation</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Phil Karlton famously said there are only two hard things in computer science:
        cache invalidation and naming things. The CDN layer makes invalidation concrete.
        When you deploy new code, CDN edges may still serve the old cached version for
        hours.
      </p>

      <div className="space-y-2">
        {[
          {
            strategy: "Content-hashed filenames (preferred)",
            detail: "Every build produces filenames with a content hash (app.a3f9c.js). Changing a file changes its URL. Old URL stays cached forever; new URL is fetched fresh. Zero invalidation needed.",
          },
          {
            strategy: "Explicit CDN purge API",
            detail: "Trigger a purge via the CDN's API at deploy time. Cloudflare purges globally in under 150ms. CloudFront invalidations take 5-30 seconds. Use path patterns (/assets/*) to batch.",
          },
          {
            strategy: "Short TTL with stale-while-revalidate",
            detail: "Set s-maxage=60 and stale-while-revalidate=30. Users see stale content for at most 90 seconds after a deploy, with zero explicit purge needed. Trade-off: more origin requests.",
          },
          {
            strategy: "Cache-busting query string",
            detail: "Append ?v=<build_id> to asset URLs. Changes on every deploy. CDN treats different query strings as different cache keys. Simple but leaves orphaned cache entries.",
          },
        ].map(({ strategy, detail }) => (
          <div key={strategy} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{strategy}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
