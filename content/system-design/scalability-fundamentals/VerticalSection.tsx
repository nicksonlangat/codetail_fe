import { CheckCircle2 } from "lucide-react";

export function VerticalSection() {
  return (
    <section>
      <h2 id="vertical-scaling" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Vertical Scaling: Bigger Hardware
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The simplest response to a struggling server is to make it bigger. More CPU cores, more RAM,
        faster SSDs. This is <strong>vertical scaling</strong>, scaling up. No code changes required.
        No distributed systems complexity. Just buy a larger instance.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Vertical scaling is like replacing a 2-lane road with an 8-lane highway. It&apos;s faster,
          but you&apos;re still building on the same piece of land, there are hard limits to how wide you can go.
        </p>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">When vertical scaling wins</h3>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "Simple and fast", desc: "No application changes. Resize the instance, restart, done. The fastest path from 'slow' to 'fast'." },
          { label: "No distributed complexity", desc: "One server means no network partitions, no consensus, no data synchronization headaches." },
          { label: "Single-threaded workloads", desc: "Some databases (older MySQL configs) or runtimes (Python GIL) benefit more from faster CPUs than more cores." },
          { label: "Stateful applications", desc: "If your app stores state in memory (sessions, caches), vertical scaling avoids the complexity of sharing that state across servers." },
        ].map(({ label, desc }) => (
          <div key={label} className="flex gap-3 p-4 bg-white border border-brand-border rounded-xl">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5 fill-brand-primary stroke-white" />
            <div>
              <p className="text-[12px] font-semibold text-brand-text mb-0.5">{label}</p>
              <p className="text-[11px] text-brand-text-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">The hard limits of vertical scaling</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Vertical scaling has a ceiling. AWS&apos;s largest instance (u-24tb1.metal) has 448 vCPUs and
        24 TB of RAM, but it costs ~$250/hour and there&apos;s exactly one size beyond it: nothing.
        More practically, the ceiling you hit first is usually cost, not physical limits.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="text-left py-2 pr-4 text-brand-text-muted font-medium">Problem</th>
              <th className="text-left py-2 text-brand-text-muted font-medium">Why vertical scaling doesn&apos;t solve it</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {[
              { prob: "Single point of failure", why: "One server equals one failure domain. It goes down, everything goes down. No amount of RAM prevents hardware failure." },
              { prob: "Geographic latency", why: "A 96-core server in Virginia is still 70ms from London. Physics doesn't care about your CPU count." },
              { prob: "Cost efficiency at scale", why: "Doubling CPU doesn't double throughput. After a point, more servers (horizontal) is cheaper than bigger servers." },
              { prob: "Maintenance windows", why: "Rebooting a single giant server takes everything offline. Multiple smaller servers can be rolled one at a time." },
            ].map((r) => (
              <tr key={r.prob}>
                <td className="py-2 pr-4 font-medium text-brand-text/80 align-top">{r.prob}</td>
                <td className="py-2 text-brand-text-muted">{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Don&apos;t skip vertical scaling prematurely.</strong> Many startups jump to microservices
          and Kubernetes before they&apos;ve proven product-market fit. A single well-tuned server can handle
          more than you think, Instagram served 30M users from 3 servers before their first major rewrite.
        </p>
      </div>
    </section>
  );
}
