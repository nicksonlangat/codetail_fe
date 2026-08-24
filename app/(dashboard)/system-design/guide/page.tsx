import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 id={id} className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
      <p className="text-[13px] text-brand-text-muted italic leading-relaxed">{children}</p>
    </div>
  );
}

function Phase({ number, time, title, children }: { number: number; time: string; title: string; children: React.ReactNode }) {
  return (
    <div className="relative pl-10 mb-8">
      <div className="absolute left-0 top-0 size-7 rounded-full bg-brand-primary flex items-center justify-center text-white text-[11px] font-bold shrink-0">
        {number}
      </div>
      <div className="mb-2 flex items-baseline gap-2">
        <h3 className="text-base font-semibold text-brand-text">{title}</h3>
        <span className="text-[11px] text-brand-text-muted font-mono">{time}</span>
      </div>
      {children}
    </div>
  );
}

function MistakeCard({ title, bad, good }: { title: string; bad: string; good: string }) {
  return (
    <div className="rounded-xl border border-brand-border bg-white p-4 space-y-3">
      <p className="text-[12px] font-semibold text-brand-text">{title}</p>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-[10px] font-mono text-brand-destructive mt-0.5 shrink-0">✗</span>
          <p className="text-[12px] text-brand-text-muted leading-5">{bad}</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[10px] font-mono text-brand-primary mt-0.5 shrink-0">✓</span>
          <p className="text-[12px] text-brand-text leading-5">{good}</p>
        </div>
      </div>
    </div>
  );
}

export default function SystemDesignGuidePage() {
  return (
    <div className="w-full max-w-3xl px-6 py-8">
      <Link
        href="/system-design"
        className="inline-flex items-center gap-1.5 text-[12px] text-brand-text-muted hover:text-brand-text transition-all duration-500 mb-8 cursor-pointer"
      >
        <ArrowLeft className="size-3.5" />
        All challenges
      </Link>

      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary mb-2">
          Start here
        </p>
        <h1 className="text-2xl font-bold text-brand-text leading-tight mb-3">
          How to ace the system design interview
        </h1>
        <p className="text-[15px] text-brand-text-muted leading-7">
          System design interviews fail for one reason most of the time: candidates jump into solutions
          before understanding the problem. This guide gives you the framework, the habits, and the
          mental models to avoid that.
        </p>
      </div>

      <Section id="what-interviewers-want" title="What interviewers actually want">
        <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
          It is not a correct answer. There is no single correct design for a distributed system.
          Interviewers are watching how you think: whether you can navigate ambiguity, make
          reasoned trade-offs, and communicate decisions clearly.
        </p>
        <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
          The four things an interviewer is scoring you on, in roughly this order:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            { label: "Problem scoping", desc: "Do you ask the right questions before drawing a single box?" },
            { label: "Breadth of knowledge", desc: "Do you know the standard components and when to reach for each one?" },
            { label: "Trade-off reasoning", desc: "Can you articulate why you chose X over Y, not just that you chose X?" },
            { label: "Communication", desc: "Is the interviewer always clear on where you are and where you are going?" },
          ].map(({ label, desc }) => (
            <div key={label} className="rounded-xl border border-brand-border bg-white p-4">
              <p className="text-[12px] font-semibold text-brand-text mb-1">{label}</p>
              <p className="text-[12px] text-brand-text-muted leading-5">{desc}</p>
            </div>
          ))}
        </div>
        <Callout>
          A candidate who designs a mediocre system while clearly explaining the trade-offs will
          outperform a candidate who designs a good system while narrating what they are drawing.
          Reasoning beats output.
        </Callout>
      </Section>

      <Section id="the-framework" title="The 4-phase framework">
        <p className="text-[15px] leading-relaxed text-brand-text/90 mb-6">
          Most system design interviews run 45 minutes. Use this structure to fill that time
          intentionally. Skipping phase 1 is the most common cause of failure.
        </p>

        <Phase number={1} time="0–10 min" title="Clarify requirements">
          <p className="text-[14px] leading-relaxed text-brand-text/90 mb-3">
            Do not touch the whiteboard yet. Ask questions. The problem statement is always
            underspecified on purpose — the interviewer is watching whether you notice.
          </p>
          <p className="text-[13px] font-semibold text-brand-text mb-2">Functional requirements: what the system does</p>
          <ul className="space-y-1.5 mb-4">
            {[
              "Who are the users and what do they do?",
              "What are the core features? (prioritize: what is in scope for this interview)",
              "What are the read vs write patterns? (read-heavy? write-heavy? both?)",
              "Any real-time requirements? (live feed, notifications, streaming)",
            ].map((q) => (
              <li key={q} className="flex items-start gap-2 text-[13px] text-brand-text-muted">
                <span className="text-brand-primary mt-1 shrink-0">›</span>
                {q}
              </li>
            ))}
          </ul>
          <p className="text-[13px] font-semibold text-brand-text mb-2">Non-functional requirements: how well the system does it</p>
          <ul className="space-y-1.5 mb-4">
            {[
              "How many users? Daily active users (DAU), monthly active users (MAU)?",
              "What scale? Requests/second, data volume per day, total storage over 5 years?",
              "Latency expectations? (p99 under 200ms? real-time under 1s?)",
              "Consistency vs availability trade-off? (can users see slightly stale data?)",
              "Durability? (can we lose a write if a server crashes?)",
            ].map((q) => (
              <li key={q} className="flex items-start gap-2 text-[13px] text-brand-text-muted">
                <span className="text-brand-primary mt-1 shrink-0">›</span>
                {q}
              </li>
            ))}
          </ul>
          <Callout>
            After requirements, state your assumptions out loud and get confirmation.
            "I am going to assume 10M DAU, mostly reads, with eventual consistency acceptable
            on the feed. Does that match what you have in mind?" This aligns expectations and
            shows you are collaborative.
          </Callout>
        </Phase>

        <Phase number={2} time="10–20 min" title="Capacity estimation">
          <p className="text-[14px] leading-relaxed text-brand-text/90 mb-3">
            Back-of-the-envelope math tells you what kind of system you need before you design it.
            Do not skip this — it drives every architectural decision.
          </p>
          <div className="bg-brand-surface rounded-xl border border-brand-border p-4 mb-4 font-mono text-[12px] space-y-2 text-brand-text">
            <p className="text-brand-text-muted not-italic text-[11px] mb-3">Example: notification system, 100M notifications/day</p>
            <p>100M / day = 100M / 86,400s ≈ <span className="text-brand-primary font-semibold">1,160 writes/second</span></p>
            <p>Peak (10x average) ≈ <span className="text-brand-primary font-semibold">12,000 writes/second</span></p>
            <p>Each notification payload ≈ 1 KB</p>
            <p>Storage/day = 100M × 1KB = <span className="text-brand-primary font-semibold">100 GB/day</span></p>
            <p>Storage/year = 100GB × 365 = <span className="text-brand-primary font-semibold">~36 TB</span></p>
          </div>
          <p className="text-[13px] text-brand-text-muted leading-5">
            These numbers now tell you: you need a write-optimized storage solution, a queue
            to absorb 12k peak writes/sec, and a plan for 36TB of data in year one.
            You would not reach for SQLite. You would reach for Cassandra or DynamoDB.
          </p>
        </Phase>

        <Phase number={3} time="20–35 min" title="High-level design then deep dive">
          <p className="text-[14px] leading-relaxed text-brand-text/90 mb-3">
            Draw the major components first: clients, API layer, services, queues, databases,
            caches. Keep it at the box-and-arrow level. Name each component. Draw data flow
            arrows with a brief label ("writes notification events", "polls for status").
          </p>
          <p className="text-[14px] leading-relaxed text-brand-text/90 mb-3">
            Then pick 2 or 3 areas and go deep. Do not try to cover everything. Let the
            interviewer steer if they want more depth somewhere specific.
          </p>
          <p className="text-[13px] font-semibold text-brand-text mb-2">Good deep dive candidates:</p>
          <ul className="space-y-1.5 mb-4">
            {[
              "The hardest part of the problem (fan-out, consistency, deduplication)",
              "The component most likely to be a bottleneck at scale",
              "An area where your choice was non-obvious — explain why",
            ].map((q) => (
              <li key={q} className="flex items-start gap-2 text-[13px] text-brand-text-muted">
                <span className="text-brand-primary mt-1 shrink-0">›</span>
                {q}
              </li>
            ))}
          </ul>
        </Phase>

        <Phase number={4} time="35–45 min" title="Review trade-offs and bottlenecks">
          <p className="text-[14px] leading-relaxed text-brand-text/90 mb-3">
            Step back and critique your own design. This is where strong candidates separate
            from average ones. Name the weakest point in the system and how you would address
            it with more time or a different constraint.
          </p>
          <p className="text-[13px] text-brand-text-muted leading-5">
            "The biggest risk in my design is the fan-out service becoming a bottleneck at
            peak. I would mitigate this by pre-computing fan-out lists for high-follower
            accounts during off-peak hours, and using a hybrid push/pull model for outliers."
          </p>
        </Phase>
      </Section>

      <Section id="common-mistakes" title="The 5 most common mistakes">
        <div className="space-y-3 mb-6">
          <MistakeCard
            title="Jumping to solutions"
            bad="Immediately drawing a microservices diagram before asking a single question."
            good="Spend the first 10 minutes only on requirements. The design flows from the constraints, not from pattern-matching to past problems."
          />
          <MistakeCard
            title="Designing for infinite scale from the start"
            bad="Proposing Kafka, Cassandra, and a CDN for a system with 1,000 users."
            good="Design for the given scale. Know what breaks first and at what threshold you would add complexity. Over-engineering is a red flag."
          />
          <MistakeCard
            title="Handwaving the database"
            bad='"I will use a database here." Full stop.'
            good="State the choice, state why. 'PostgreSQL for user data because writes are low-volume and ACID guarantees matter for billing. Cassandra for the notification log because it is write-heavy and we can tolerate eventual consistency.'"
          />
          <MistakeCard
            title="Silent designing"
            bad="Drawing for 5 minutes without saying a word."
            good="Narrate every decision as you make it. If you are thinking, say what you are thinking. The interviewer cannot grade reasoning they cannot hear."
          />
          <MistakeCard
            title="Ignoring failure modes"
            bad="A design where every service works perfectly and no server ever fails."
            good="Proactively mention: what happens when the queue is full? What if the push provider is down? What if a worker crashes mid-fan-out? Show you design for failure."
          />
        </div>
      </Section>

      <Section id="when-stuck" title="What to do when you get stuck">
        <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
          Getting stuck is normal. What matters is how you handle it.
        </p>
        <div className="space-y-4 mb-6">
          {[
            {
              trigger: "You do not know which database to use",
              move: "Ask yourself: read-heavy or write-heavy? Structured or unstructured? Need transactions? This flowchart almost always gets you to the right family of database.",
            },
            {
              trigger: "You do not know how to handle scale",
              move: "Name the bottleneck first. 'This API server will hit CPU limits at ~5k req/s. To go beyond that I would horizontal-scale behind a load balancer.' Naming the problem is already a good answer.",
            },
            {
              trigger: "You have genuinely not seen the pattern before",
              move: "Say so, then reason from first principles. 'I haven't built this before, but the problem looks similar to X because of Y. I would start with Z and see what breaks.' Honesty plus reasoning beats bluffing.",
            },
            {
              trigger: "You are running out of time",
              move: "Signal it. 'I want to keep moving — I will leave the monitoring and alerting design as a note and come back if we have time.' Controlling pace is a senior skill.",
            },
          ].map(({ trigger, move }) => (
            <div key={trigger} className="rounded-xl border border-brand-border bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text-muted mb-2">
                When: {trigger}
              </p>
              <p className="text-[13px] text-brand-text leading-5">{move}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="vocabulary" title="Vocabulary that signals seniority">
        <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
          These are not buzzwords to drop — they are precise terms that communicate a specific
          concept efficiently. Use them when you mean them.
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left py-2 pr-6 text-brand-text-muted font-medium">Term</th>
                <th className="text-left py-2 text-brand-text-muted font-medium">When to use it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {[
                { term: "Idempotent", use: "An operation that produces the same result whether called once or ten times. Critical for retries." },
                { term: "At-least-once delivery", use: "The queue delivers every message, but may deliver some twice. Acceptable when you can deduplicate downstream." },
                { term: "Head-of-line blocking", use: "A slow item at the front of a queue blocks all items behind it. Reason to use multiple queues or priority lanes." },
                { term: "Fan-out", use: "One event triggers writes to many destinations. The design challenge in notification systems, social feeds." },
                { term: "Back-pressure", use: "When a downstream service signals 'slow down' to the upstream producer. Prevents cascading failure." },
                { term: "Hot partition", use: "One shard getting disproportionate traffic due to a popular key. Design data models to avoid it." },
                { term: "Write-through / write-behind cache", use: "Whether the cache is populated on write (through) or asynchronously (behind). Different consistency guarantees." },
              ].map(({ term, use }) => (
                <tr key={term}>
                  <td className="py-2.5 pr-6 font-mono text-brand-primary align-top">{term}</td>
                  <td className="py-2.5 text-brand-text-muted">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="mt-12 rounded-xl border border-brand-primary/30 bg-brand-primary/5 p-6 flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-brand-text mb-1">Ready to practice?</p>
          <p className="text-[13px] text-brand-text-muted">
            Apply the framework on a real challenge. Fill in your design, submit for AI review.
          </p>
        </div>
        <Link
          href="/system-design/design-notification-system"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold cursor-pointer transition-all duration-500 hover:bg-brand-primary-hover shrink-0"
        >
          Start challenge <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
