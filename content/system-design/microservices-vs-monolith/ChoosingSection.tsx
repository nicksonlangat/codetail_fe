const DECISION_ROWS = [
  {
    signal: "Team of 1-10 engineers",
    monolith: "best",
    microservices: "poor",
    notes: "Microservices overhead dominates. One engineer cannot own 8 services meaningfully. Monolith maximizes velocity at this scale.",
  },
  {
    signal: "Team of 50+ engineers across multiple squads",
    monolith: "ok",
    microservices: "best",
    notes: "Conway's Law: system architecture mirrors communication structure. Large teams shipping independently require independent deploy units.",
  },
  {
    signal: "Early-stage product with unclear boundaries",
    monolith: "best",
    microservices: "poor",
    notes: "Service boundaries drawn too early become walls around wrong abstractions. Start monolith; let domain understanding emerge before splitting.",
  },
  {
    signal: "Components with wildly different scaling requirements",
    monolith: "poor",
    microservices: "best",
    notes: "Image processing needs GPU VMs; API gateway needs many small instances. Scaling the full monolith wastes resources.",
  },
  {
    signal: "Components need different language runtimes",
    monolith: "poor",
    microservices: "best",
    notes: "ML inference in Python, latency-critical API in Go, data pipeline in Scala. Service boundaries are the only way to mix runtimes.",
  },
  {
    signal: "Strict failure isolation between components",
    monolith: "poor",
    microservices: "best",
    notes: "A memory leak in recommendations taking down checkout is unacceptable. Process isolation is the only real blast radius limit.",
  },
  {
    signal: "Frequent cross-cutting feature changes",
    monolith: "best",
    microservices: "poor",
    notes: "A feature touching 5 services needs 5 PRs, 5 deploys, 5 code reviews. In a monolith it is one PR.",
  },
  {
    signal: "Strong need for local development simplicity",
    monolith: "best",
    microservices: "poor",
    notes: "Running 10 services locally requires Docker Compose or a dev cluster. A monolith starts with one command.",
  },
  {
    signal: "Regulated environment requiring audit trails per service",
    monolith: "ok",
    microservices: "best",
    notes: "Independent services can have independent audit logs, access controls, and compliance boundaries per domain.",
  },
  {
    signal: "Rapid iteration on a well-understood domain",
    monolith: "ok",
    microservices: "best",
    notes: "Once boundaries are stable and teams are aligned to services, each team ships faster independently than in a shared codebase.",
  },
];

const SCORE_STYLE: Record<string, string> = {
  best: "text-brand-primary bg-brand-primary/10 border-brand-primary/20",
  ok: "text-brand-text-muted bg-brand-surface border-brand-border",
  poor: "text-brand-warning bg-brand-warning/10 border-brand-warning/20",
};
const SCORE_LABEL: Record<string, string> = {
  best: "best fit",
  ok: "workable",
  poor: "avoid",
};

export function ChoosingSection() {
  return (
    <section>
      <h2 id="choosing" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Choosing an Architecture
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The right architecture is determined by your team size, your domain maturity, and
        your operational capability, not by what Netflix or Google does. Netflix and Google
        chose microservices to solve problems that arose from thousands of engineers, years
        of domain knowledge, and mature platform engineering teams. Copying the solution
        without the context produces the costs without the benefits.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Decision matrix</h3>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="text-left py-2 pr-4 text-brand-text-muted font-medium">Signal</th>
              <th className="text-left py-2 pr-3 text-brand-text-muted font-medium">Monolith</th>
              <th className="text-left py-2 pr-4 text-brand-text-muted font-medium">Microservices</th>
              <th className="text-left py-2 text-brand-text-muted font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {DECISION_ROWS.map(({ signal, monolith, microservices, notes }) => (
              <tr key={signal}>
                <td className="py-2.5 pr-4 text-brand-text/80 align-top">{signal}</td>
                {[monolith, microservices].map((score, i) => (
                  <td key={i} className="py-2.5 pr-3 align-top">
                    <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap ${SCORE_STYLE[score]}`}>
                      {SCORE_LABEL[score]}
                    </span>
                  </td>
                ))}
                <td className="py-2.5 text-brand-text-muted align-top">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Conway&apos;s Law</h3>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[13px] italic text-brand-text/70 mb-3">
          &quot;Any organization that designs a system will produce a design whose structure is a
          copy of the organization&apos;s communication structure.&quot; (Melvin Conway, 1968)
        </p>
        <p className="text-[11px] text-brand-text-muted">
          Conway&apos;s Law is descriptive, not prescriptive. Your system will mirror your team
          structure whether you intend it to or not. The inverse is also useful: if you want
          a microservices architecture, first restructure your teams so each team owns a domain
          end-to-end. Service ownership follows team ownership. Trying to implement microservices
          without reorganizing teams produces a distributed monolith: network calls where there
          used to be function calls, with none of the independence.
        </p>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">The distributed monolith antipattern</h3>

      <div className="space-y-2 mb-8">
        {[
          { label: "Services share a database", detail: "Direct table access across service boundaries. Any schema change requires coordinating every service that reads that table. The key benefit of microservices, data isolation, does not exist." },
          { label: "Synchronous chains of service calls", detail: "Service A calls B which calls C which calls D before returning. Latency compounds. One slow service freezes the chain. The failure modes of a monolith without the simplicity." },
          { label: "Coupled deploys", detail: "Deploying service A requires deploying service B first because of a breaking API change. These services are not independent, they are a monolith that requires two deploy commands." },
          { label: "No team owns a service end-to-end", detail: "Every service is owned by a platform team. Domain teams make changes but do not control deploys. The deployment independence that justifies microservices does not exist." },
        ].map(({ label, detail }) => (
          <div key={label} className="flex gap-3 p-3 rounded-xl border border-brand-warning/20 bg-brand-warning/5">
            <span className="text-brand-warning text-sm shrink-0 mt-0.5 font-bold">!</span>
            <div>
              <p className="text-[12px] font-semibold text-brand-text mb-0.5">{label}</p>
              <p className="text-[11px] text-brand-text-muted">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Rules of thumb</h3>

      <div className="space-y-2">
        {[
          {
            rule: "Start with a modular monolith",
            detail: "Enforce module boundaries in the codebase before you enforce them with network calls. If you cannot write clean module interfaces in a monolith, you cannot design clean service APIs.",
          },
          {
            rule: "Extract services when you feel the pain, not before",
            detail: "Deploy collisions, scaling bottlenecks, and team autonomy needs are the real signals. Architecture decisions driven by pain are better than ones driven by hype.",
          },
          {
            rule: "One team, one service",
            detail: "A service without a clear team owner accumulates shared ownership debt. Shared ownership means no ownership. Each service should have a named team responsible for its uptime, its API, and its data.",
          },
          {
            rule: "Use the strangler fig for migration, never a big rewrite",
            detail: "Big-bang rewrites from monolith to microservices fail at a very high rate. Incremental extraction keeps the monolith in production throughout and limits risk to one service at a time.",
          },
          {
            rule: "Count your services before you add another",
            detail: "Every service is a permanent operational commitment. Before adding a new service, ask whether the problem could be solved by a module in an existing service. The answer is often yes.",
          },
        ].map(({ rule, detail }) => (
          <div key={rule} className="flex gap-3 p-3 rounded-xl border border-brand-border bg-white">
            <span className="text-brand-primary font-bold text-sm shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold text-brand-text mb-0.5">{rule}</p>
              <p className="text-[11px] text-brand-text-muted">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
