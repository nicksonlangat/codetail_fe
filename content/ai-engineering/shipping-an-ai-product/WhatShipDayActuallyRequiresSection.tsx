export function WhatShipDayActuallyRequiresSection() {
  return (
    <section>
      <h2 id="what-ship-day-actually-requires" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        What actually has to be true before this goes live
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Not a demo working once in a playground. A specific, checkable list, each item earned by a
        specific article in this series rather than assumed.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The golden set passes, including the deliberately ugly cases, off-topic questions, empty
        input, a question the documentation genuinely doesn&apos;t answer. The account-lookup tool
        has no permissions beyond what this feature needs, and a proposed action that looks out of
        scope gets caught by the output filter before it takes effect. Every request is traced end
        to end, so &quot;the assistant gave a wrong answer&quot; is something that can actually be
        investigated instead of shrugged at. And there&apos;s a real answer, tested and not just
        assumed, for what happens when confidence is low: a clear handoff to a human, not a
        confident guess dressed up as one.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Just as deliberate is the list of what this version doesn&apos;t do. No fine-tuning,
        prompting and retrieval handle this task without it. No multi-agent orchestration, one
        agent with a small, well-scoped toolset covers everything this feature actually needs to
        do. Both are real capabilities covered earlier in this series, and both are correctly
        absent here, because the simpler system was sufficient and reaching for either without a
        specific reason would have added cost and failure surface for nothing in return.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Every piece across all fifteen articles in this series exists to answer one question
        honestly, for this specific feature: not whether it&apos;s impressive, but whether it
        works, whether it&apos;s checked, and whether someone will actually know when it stops
        working. That&apos;s the whole job.
      </p>
    </section>
  );
}
