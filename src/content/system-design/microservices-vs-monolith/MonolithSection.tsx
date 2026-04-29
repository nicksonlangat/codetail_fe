const MONOLITH_MYTHS = [
  {
    myth: "Monoliths don't scale",
    reality: "A single well-written process can serve millions of requests per second. Stack Overflow, Shopify, and Basecamp all ran on monoliths at massive scale. Horizontal scaling (multiple instances behind a load balancer) applies equally to monoliths.",
  },
  {
    myth: "Monoliths are always big balls of mud",
    reality: "Coupling is a code quality problem, not an architecture problem. A monolith with strict module boundaries and enforced internal APIs is less coupled than a microservices system where services call each other synchronously in a chain.",
  },
  {
    myth: "Microservices automatically give you independent deployability",
    reality: "Services that share a database, or where deploying service A always requires coordinating with service B, are not independently deployable regardless of what they are called.",
  },
  {
    myth: "You need microservices to move fast",
    reality: "A small team moves faster in a monolith. Cross-service features in a microservices system require coordinating PRs across multiple repos, staging environments, and release schedules. That coordination cost is real.",
  },
];

export function MonolithSection() {
  return (
    <section>
      <h2 id="monolith" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        The Monolith Is Not the Problem
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A monolith is a system where all components run in a single process and are deployed
        as a single unit. Every HTTP handler, every database query, every background job
        exists in the same codebase and ships together. This is not a legacy pattern. It is
        the correct default for most systems at most stages of their lifecycle.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The monolith's advantages compound in the early stages of a product. Developers run
        the entire system locally with one command. Integration tests exercise the whole
        request path without stubbing network calls. Refactoring crosses module boundaries
        freely because the compiler checks everything at once. There is no distributed systems
        tax: no network latency between components, no serialization overhead, no partial
        failure to handle.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">The modular monolith</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The failure mode of a monolith is not the architecture — it is the coupling. When
        every module imports from every other module directly, the codebase becomes a
        big-ball-of-mud where a change anywhere can break anything. The solution is not to
        split into services. It is to enforce internal boundaries.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A modular monolith enforces API contracts between modules at the code level. The Orders
        module cannot import directly from the Payments module's internals. It calls a
        published interface. Each module owns its own database schema. This discipline produces
        the same conceptual isolation as microservices — without the operational overhead.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Modular monolith — enforced boundaries in Python/Django
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`# Good: Orders calls the Payments public API
from payments.api import charge_card   # public interface

# Bad: Orders reaches into Payments internals
from payments.models import StripeCharge  # crosses boundary

# Module structure
src/
  orders/
    api.py          # public interface — only this is importable
    _internal.py    # private — other modules must not import this
    models.py
  payments/
    api.py
    _internal.py
    models.py`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">When a monolith genuinely struggles</h3>

      <div className="space-y-2 mb-6">
        {[
          {
            signal: "Deploy frequency conflict",
            desc: "Team A deploys hotfixes five times a day. Team B owns a long-running release cycle. When they share a deploy pipeline, the slower team blocks the faster one.",
          },
          {
            signal: "Wildly different scaling requirements",
            desc: "The image processing component needs 64-core machines. The API gateway needs many small instances. Scaling the monolith means scaling both together, wastefully.",
          },
          {
            signal: "Different runtime requirements",
            desc: "One component needs Python for ML. Another needs Go for latency. A monolith forces a single runtime and language stack.",
          },
          {
            signal: "Blast radius of a failure is too large",
            desc: "A memory leak in the recommendation engine taking down the checkout flow is unacceptable. Isolation requires process boundaries.",
          },
          {
            signal: "Team size exceeds two-pizza rule per module",
            desc: "When a module is owned by 20 engineers, merge conflicts and coordination overhead dominate. The module needs to become a service with its own team.",
          },
        ].map(({ signal, desc }) => (
          <div key={signal} className="flex gap-3 p-3 rounded-xl border border-orange-400/20 bg-orange-400/5">
            <span className="text-orange-500 text-sm flex-shrink-0 mt-0.5">!</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{signal}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Myths worth dispelling</h3>

      <div className="space-y-2">
        {MONOLITH_MYTHS.map(({ myth, reality }) => (
          <div key={myth} className="bg-card border border-border rounded-xl p-3">
            <p className="text-[11px] font-semibold text-orange-500 mb-1">Myth: {myth}</p>
            <p className="text-[11px] text-muted-foreground">Reality: {reality}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
