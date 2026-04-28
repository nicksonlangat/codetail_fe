import { VerticalSection } from "./scalability-fundamentals/VerticalSection";
import { HorizontalSection } from "./scalability-fundamentals/HorizontalSection";
import { LoadBalancerSection } from "./scalability-fundamentals/LoadBalancerSection";
import { PatternsSection } from "./scalability-fundamentals/PatternsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "vertical-scaling", title: "Vertical Scaling" },
  { id: "horizontal-scaling", title: "Horizontal Scaling" },
  { id: "load-balancer-algorithms", title: "Load Balancer Algorithms" },
  { id: "scaling-patterns", title: "Real-World Patterns" },
  { id: "summary", title: "Summary" },
];

export default function ScalabilityFundamentalsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Every system starts small and eventually gets popular. The traffic doubles, then doubles
          again. The database gets slow. The single server starts dropping requests. You need to scale.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          "Scalability" is the property of a system to handle growing demand by adding resources.
          But resources come in different forms — and knowing which kind to add, when, is the
          difference between a clean architecture and a distributed systems nightmare.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers the two fundamental scaling axes — vertical and horizontal — their
          real trade-offs, and the architectural patterns that make horizontal scaling practical.
        </p>
      </section>

      <VerticalSection />
      <HorizontalSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <LoadBalancerSection />
      <PatternsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "⬆️", label: "Vertical first", desc: "When in doubt, scale vertically. It's instant, simple, and works better than people expect. Many systems never need horizontal scaling." },
            { icon: "↔️", label: "Horizontal requires statelessness", desc: "App servers must not hold user state in memory. Sessions in Redis, files in S3, config via env vars. Any server must handle any request." },
            { icon: "⚖️", label: "Algorithm matches workload", desc: "Round-robin for uniform requests. Least-connections for variable-duration work. IP-hash for sticky sessions. No single answer." },
            { icon: "🗄️", label: "Database is the bottleneck", desc: "App servers scale easily. Databases are hard. Read replicas first. Connection pooling. Cache aggressively. Sharding is a last resort." },
            { icon: "⚡", label: "Cache is the best scale", desc: "A cache hit does zero database work. At 90% cache hit rate, you serve 10× the traffic with the same DB. Invest in caching before adding hardware." },
            { icon: "📊", label: "Keep utilization below 70%", desc: "Response time degrades non-linearly near capacity. At 80% utilization, a traffic spike to 90% can cause cascading failures. Run with headroom." },
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
