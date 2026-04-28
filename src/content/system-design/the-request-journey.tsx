import { OverviewSection } from "./the-request-journey/OverviewSection";
import { DNSSection } from "./the-request-journey/DNSSection";
import { TCPSection } from "./the-request-journey/TCPSection";
import { ApplicationSection } from "./the-request-journey/ApplicationSection";
import { LatencySection } from "./the-request-journey/LatencySection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "overview", title: "The 13-step journey" },
  { id: "dns-resolution", title: "Step 1: DNS Resolution" },
  { id: "tcp-tls", title: "Step 2: TCP & TLS" },
  { id: "application-layer", title: "Steps 3–5: LB, Server & DB" },
  { id: "latency-budget", title: "The Latency Budget" },
  { id: "summary", title: "Summary" },
];

export default function TheRequestJourneyArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Every web request is a small miracle. In the time it takes you to blink, your browser has
          consulted a global naming system, negotiated an encrypted connection across continents,
          asked a load balancer to pick a server, run your application code, queried a database, and
          assembled a response — then sent it all back.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          Understanding each step isn't academic. It's how you debug a 400ms latency spike,
          design a system that handles 100,000 requests per second, and make intelligent decisions
          about where to add caches, replicas, and CDNs. Let's trace the journey.
        </p>
      </section>

      <OverviewSection />
      <DNSSection />
      <TCPSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <ApplicationSection />
      <LatencySection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "📡", label: "DNS is layered caching", desc: "Browser → OS → resolver → hierarchy. A cache hit at any layer skips the rest. Lower TTLs before migrations." },
            { icon: "🔗", label: "TCP + TLS costs RTTs", desc: "TCP costs 1 RTT, TLS 1.3 adds 1 more. HTTP/3 + QUIC merges both into 0 RTTs for warm connections." },
            { icon: "⚖️", label: "Load balancers are essential", desc: "They enable horizontal scaling, handle health checks, and terminate TLS. Stateless backends are the goal." },
            { icon: "🗄️", label: "The DB is the bottleneck", desc: "Indexes turn O(n) scans into O(log n) lookups. Cache aggressively. Avoid N+1 queries." },
            { icon: "⚡", label: "Cache every safe thing", desc: "Redis between server and DB. CDN between user and server. Cache hits skip the most expensive hops." },
            { icon: "🌍", label: "Physics is the floor", desc: "You can't beat the speed of light. CDNs and edge nodes bring your servers physically closer to users." },
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
