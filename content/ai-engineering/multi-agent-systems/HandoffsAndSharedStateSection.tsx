export function HandoffsAndSharedStateSection() {
  return (
    <section>
      <h2 id="handoffs-and-shared-state" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        What crosses the boundary between two agents matters more than the boundary itself
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The orchestrator and a worker don&apos;t share a context window. Whatever the orchestrator
        knows, the worker only knows if it was explicitly passed across, and the two obvious ways
        to pass it have very different failure modes.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Handing over the entire conversation so far is the simplest option and the most expensive
        one, every token of it counts against the worker&apos;s own context budget, and most of
        that history is irrelevant to the narrow job the worker actually has to do. A structured
        handoff, a small, explicit set of fields the orchestrator decided the worker actually
        needs, costs less and forces a decision about what&apos;s relevant instead of deferring
        that decision to &quot;just include everything.&quot;
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The failure mode of the structured version is real too: a field the worker actually needed
        wasn&apos;t included, because the orchestrator&apos;s idea of &quot;what&apos;s relevant&quot;
        was wrong. That&apos;s a bug to catch with the same golden-set testing this series covers
        for prompts generally, not a reason to default back to passing everything, the same way
        one under-specified API request isn&apos;t a reason to stop specifying request schemas at
        all.
      </p>
    </section>
  );
}
