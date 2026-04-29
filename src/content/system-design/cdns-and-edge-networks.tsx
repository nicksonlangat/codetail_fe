import { HowCDNsWorkSection } from "./cdns-and-edge-networks/HowCDNsWorkSection";
import { CacheControlSection } from "./cdns-and-edge-networks/CacheControlSection";
import { EdgeComputingSection } from "./cdns-and-edge-networks/EdgeComputingSection";
import { WhatToServeSection } from "./cdns-and-edge-networks/WhatToServeSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "how-cdns-work", title: "How CDNs Work" },
  { id: "cache-control", title: "Cache-Control Headers" },
  { id: "edge-computing", title: "Edge Computing" },
  { id: "what-to-serve", title: "What to Put on a CDN" },
  { id: "summary", title: "Summary" },
];

export default function CDNsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A CDN moves your content closer to your users. Instead of every request
          traveling to a single origin server, content is cached at hundreds of edge
          nodes distributed globally. A user in Sydney gets their assets from a PoP in
          Singapore at 15ms, not from us-east-1 at 200ms. For static content, the origin
          is never involved after the first cache miss.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Cache-Control headers are the primary interface between your application and the
          CDN. They tell the CDN how long to cache a response, whether it can be shared
          across users, and what to do when the cache is stale. Getting these right
          determines your cache hit rate — and your origin's load.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          Modern CDNs go beyond static file caching. Edge computing platforms (Cloudflare
          Workers, Lambda@Edge) run JavaScript at the PoP, enabling authentication checks,
          A/B testing, geo-routing, and bot filtering in milliseconds — before the request
          reaches the origin at all. This article covers how CDNs work, how to control
          their behavior with cache headers, what runs well at the edge, and what should
          never be cached.
        </p>
      </section>

      <HowCDNsWorkSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <CacheControlSection />
      <EdgeComputingSection />
      <WhatToServeSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🌍",
              label: "CDNs reduce latency by geo-proximity",
              desc: "Edge PoPs serve cached content milliseconds from users. A 200ms origin round trip becomes 15ms from the nearest PoP. The origin is only hit on cache misses.",
            },
            {
              icon: "⚙️",
              label: "Cache-Control drives CDN behavior",
              desc: "max-age, s-maxage, no-store, private, stale-while-revalidate. Get these right and your cache hit rate is high. Get them wrong and personalized content leaks across users.",
            },
            {
              icon: "♾️",
              label: "Content-hash filenames enable infinite caching",
              desc: "app.a3f9c.js never changes. Cache for a year with immutable. Changing the file changes the URL. No purge needed — the old URL simply ages out.",
            },
            {
              icon: "⚡",
              label: "Edge workers run logic at the PoP",
              desc: "V8 isolates start in under 1ms. Auth checks, A/B routing, geo-redirects, and bot filtering all run at the edge. The origin sees only requests that passed all checks.",
            },
            {
              icon: "🔒",
              label: "Never cache authenticated responses on shared caches",
              desc: "Cache-Control: private prevents CDN caching. Vary: Cookie effectively disables it. Serving user A's data to user B from a shared cache is a security incident.",
            },
            {
              icon: "🛡️",
              label: "CDN is the right layer for security headers",
              desc: "HSTS, X-Frame-Options, CSP, and Permissions-Policy injected at the CDN apply to every response from every origin — including error pages and redirects.",
            },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <div>
                <p className="text-[13px] font-semibold mb-0.5">{label}</p>
                <p className="text-[12px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
