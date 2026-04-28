import { RequestFlowVisualizer } from "@/components/blog/interactive/request-flow-visualizer";

export function OverviewSection() {
  return (
    <section>
      <h2 id="overview" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        The 13-step journey
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        You type <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">https://google.com</code> and
        hit Enter. In the next 100–500 milliseconds, your browser orchestrates a remarkable sequence of
        events across multiple systems — DNS resolvers, TCP connections, load balancers, application
        servers, databases, and back again.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Most developers use the web every day without knowing what's happening beneath the surface.
        That's fine until you need to debug a latency problem, design a system that handles millions
        of requests, or reason about where a failure is coming from. Step through the full journey below.
      </p>

      <RequestFlowVisualizer />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Each hop in this chain has its own characteristics: latency, failure modes, caching behavior,
        and optimization opportunities. We'll cover each in depth.
      </p>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          Understanding this flow is the foundation of system design. Every scaling, caching, and
          reliability decision you'll ever make is rooted in knowing exactly what happens here.
        </p>
      </div>
    </section>
  );
}
