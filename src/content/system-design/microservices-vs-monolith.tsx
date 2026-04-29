import { MonolithSection } from "./microservices-vs-monolith/MonolithSection";
import { MicroservicesSection } from "./microservices-vs-monolith/MicroservicesSection";
import { MigrationSection } from "./microservices-vs-monolith/MigrationSection";
import { ChoosingSection } from "./microservices-vs-monolith/ChoosingSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "monolith", title: "The Monolith" },
  { id: "microservices", title: "Microservices" },
  { id: "migration", title: "Migrating: Strangler Fig" },
  { id: "choosing", title: "Choosing an Architecture" },
  { id: "summary", title: "Summary" },
];

export default function MicroservicesArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The monolith versus microservices debate is often framed as a technology choice.
          It is an organizational choice that happens to have technology implications.
          Microservices give teams deployment independence, scaling autonomy, and technology
          freedom. They pay for these properties with distributed systems complexity: network
          calls, partial failures, distributed tracing, and data consistency across service
          boundaries.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A monolith is not a failure to adopt microservices. It is a deliberate choice to
          avoid that complexity — and for most teams at most stages, it is the correct one.
          Shopify, Stack Overflow, and Basecamp serve millions of users from monoliths.
          The question is not which architecture is better in the abstract, but which one
          fits your team size, domain maturity, and operational capability right now.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article explains what a monolith actually is (and what its failure modes are),
          what microservices genuinely give you (and what they cost), how to migrate from one
          to the other incrementally using the strangler fig pattern, and how to make the
          choice without being driven by hype.
        </p>
      </section>

      <MonolithSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <MicroservicesSection />
      <MigrationSection />
      <ChoosingSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🧱",
              label: "Monolith is the correct default",
              desc: "One codebase, one deploy, one process. Fast local development, easy refactoring, no distributed systems complexity. The right choice for most teams at most stages.",
            },
            {
              icon: "📦",
              label: "Modular monolith prevents the big ball of mud",
              desc: "Enforce internal module boundaries and API contracts before moving to services. If modules are clean, extraction is possible. If they are tangled, extraction is painful.",
            },
            {
              icon: "🔀",
              label: "Microservices give team autonomy at a cost",
              desc: "Independent deployability, independent scaling, technology freedom. Payment: distributed tracing, network latency, partial failure handling, data consistency across boundaries.",
            },
            {
              icon: "🪴",
              label: "Use the strangler fig to migrate",
              desc: "Extract services one module at a time. Route traffic through a facade. Build the new service in parallel. Migrate data last. Delete the old module after a soak period.",
            },
            {
              icon: "🏛️",
              label: "Conway's Law: teams shape systems",
              desc: "Your architecture mirrors your communication structure. Microservices require teams that own services end-to-end. Shared ownership of a service is no ownership.",
            },
            {
              icon: "⚠️",
              label: "Distributed monolith is the worst outcome",
              desc: "Services sharing a database, or requiring coordinated deploys, or owned by no clear team — this is microservices complexity with none of the independence. Avoid it.",
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
