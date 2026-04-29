import { RequirementsSection } from "./design-a-real-system/RequirementsSection";
import { CoreDesignSection } from "./design-a-real-system/CoreDesignSection";
import { ScalingSection } from "./design-a-real-system/ScalingSection";
import { ProductionSection } from "./design-a-real-system/ProductionSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "requirements", title: "Requirements and Capacity Estimation" },
  { id: "core-design", title: "Core Design" },
  { id: "scaling", title: "Scaling the Read and Write Paths" },
  { id: "production", title: "Production" },
  { id: "summary", title: "Summary" },
];

export default function DesignARealSystemArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The previous articles in this series covered the building blocks of distributed
          systems in isolation: databases, caching, CDNs, rate limiting, message queues,
          and resilience patterns. This article applies them all at once to a single system.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          We will design a URL shortener end to end: from requirements and capacity estimation
          through the core data model and redirect API, to caching strategy, write path
          protections, analytics pipeline, and resilience. Every design decision references
          a pattern from earlier in the series.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          The goal is not to produce the most sophisticated design possible. It is to produce
          the simplest design that meets the stated requirements, with a clear understanding
          of when and how it would need to evolve.
        </p>
      </section>

      <RequirementsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <CoreDesignSection />
      <ScalingSection />
      <ProductionSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "📐",
              label: "Start with requirements, not solutions",
              desc: "Define functional requirements, non-functional requirements, and capacity estimates before touching the architecture. The numbers tell you what you need to build.",
            },
            {
              icon: "🔑",
              label: "Counter + Base62 for code generation",
              desc: "Auto-increment ID encoded as Base62 gives zero collisions, no uniqueness checks, and 3.5 trillion codes at 7 characters. Simpler than hashing; better than random.",
            },
            {
              icon: "⚡",
              label: "Serve redirects from cache, not the database",
              desc: "URL shorteners are read-heavy at 100:1 or more. A 90% Redis cache hit rate reduces DB load by 10x. Cache TTL matches URL expiry. Invalidate on deletion.",
            },
            {
              icon: "📊",
              label: "Analytics must not block the redirect path",
              desc: "Fire a Kafka event on each redirect and return immediately. A consumer batch-inserts into ClickHouse. Analytics loss is acceptable; redirect latency increase is not.",
            },
            {
              icon: "🛡️",
              label: "Wrap every external dependency in a circuit breaker",
              desc: "Redis failing should degrade to higher DB load, not to user-visible errors. The circuit breaker stops calls to a known-failing dependency and enables graceful fallback.",
            },
            {
              icon: "🗺️",
              label: "Use the interview framework: requirements, estimate, design, dive, operate",
              desc: "Structure the 45-minute session deliberately. Spend 10 minutes on requirements and capacity before drawing any boxes. The deep dive is where you demonstrate depth.",
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
