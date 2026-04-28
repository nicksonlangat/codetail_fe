import { WhatIsSection } from "./load-balancing/WhatIsSection";
import { AlgorithmsSection } from "./load-balancing/AlgorithmsSection";
import { HealthChecksSection } from "./load-balancing/HealthChecksSection";
import { AdvancedSection } from "./load-balancing/AdvancedSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-is-a-load-balancer", title: "What is a load balancer?" },
  { id: "algorithms", title: "Distribution Algorithms" },
  { id: "health-checks", title: "Health Checks and Failure" },
  { id: "advanced-features", title: "SSL, Sticky Sessions, Global LB" },
  { id: "summary", title: "Summary" },
];

export default function LoadBalancingArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Your single server just hit its limit. You add a second one. Now what? Two servers
          sitting behind a shared domain both want to handle traffic, but something has to
          decide which request goes where. That something is a load balancer.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Load balancing is foundational to every high-scale architecture. It enables horizontal
          scaling, provides redundancy, and unlocks zero-downtime deployments. Understanding
          how it works, and which algorithm fits which workload, is essential knowledge for
          anyone building or debugging distributed systems.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers what load balancers do, the algorithms they use, how they
          detect and handle server failures, and the advanced features that appear in
          production architectures.
        </p>
      </section>

      <WhatIsSection />
      <AlgorithmsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <HealthChecksSection />
      <AdvancedSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "⚖️", label: "LB is a reverse proxy", desc: "Clients connect to the LB. The LB forwards to backends. Clients never see the backend fleet directly." },
            { icon: "🔍", label: "L4 vs L7 is a capability trade-off", desc: "L4 is faster, protocol-agnostic. L7 is smarter: routing by URL, header injection, cookie-based affinity, SSL termination." },
            { icon: "🔄", label: "Choose the algorithm for your workload", desc: "Round-robin for uniform work. Least-connections for variable-duration. IP-hash for affinity. Weighted for heterogeneous fleets." },
            { icon: "🏥", label: "Health checks are load balancing's heartbeat", desc: "Without active health checks, a failed server still receives traffic. Check real dependencies in /health, not just process liveness." },
            { icon: "🍪", label: "Sticky sessions are a last resort", desc: "If you need them, you have a stateful architecture problem. Move session state to Redis and remove the dependency." },
            { icon: "🌍", label: "GeoDNS + Anycast for global routing", desc: "Route users to the nearest data center. Anycast reacts in sub-seconds. GeoDNS is bound by TTL. CDNs use both." },
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
