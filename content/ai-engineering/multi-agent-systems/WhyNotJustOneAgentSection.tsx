export function WhyNotJustOneAgentSection() {
  return (
    <section>
      <h2 id="why-not-just-one-bigger-agent" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Every extra agent is a coordination problem a single one doesn&apos;t have
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Before the patterns in this article, the case against them. A single agent with a wide
        toolset and a clear system prompt handles more than it gets credit for, and it has no
        coordination problem at all: one context, one history, one place decisions get made.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Splitting that into multiple agents adds a question that didn&apos;t exist before: who
        talks to whom, in what order, and who has the final say when two agents disagree. That
        question doesn&apos;t go away because the system got more sophisticated-sounding, it just
        moves from &quot;inside one prompt&quot; to &quot;across a boundary between two
        processes,&quot; which is a strictly harder place to debug it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Reach for multiple agents when a single one&apos;s context or toolset genuinely can&apos;t
        hold what the task needs, not because splitting a problem into named roles sounds more
        like how a real team would do it. A team of agents inherits a team&apos;s coordination
        overhead along with its capabilities.
      </p>
    </section>
  );
}
