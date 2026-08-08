export function WhatAgenticActuallyBuysSection() {
  return (
    <section>
      <h2 id="what-agentic-actually-buys-you" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The loop is worth it when you can&apos;t predict the steps ahead of time
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A task with a fixed, known sequence, look up the account, then check the invoice, then
        format a response, isn&apos;t an argument for a loop at all. That&apos;s regular code that
        happens to call a model once or twice, and writing it as an unbounded agent loop adds
        cost, latency, and an extra place for something to go wrong, for zero benefit, the sequence
        was never actually in question.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The loop earns its complexity specifically when the next step genuinely depends on what
        the last tool call returned, and can&apos;t be known before that. Debugging an error
        message that could point to five different root causes, where which one to check next
        depends on what the last check turned up, is the shape of problem a loop is actually built
        for.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The test worth applying before reaching for a loop: can you write down the steps in
        advance. If yes, write them down, as code, and let the model fill in one or two of them.
        If the honest answer is no, that&apos;s the signal an agent is the right shape for the
        problem, not a default to reach for because it sounds more capable.
      </p>
    </section>
  );
}
