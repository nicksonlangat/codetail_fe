export function DebuggingNonDeterminismSection() {
  return (
    <section>
      <h2 id="debugging-something-that-wont-reproduce" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        &quot;I can&apos;t reproduce it&quot; doesn&apos;t mean it didn&apos;t happen
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The same request, sent twice, can come back with two different answers. For a traditional
        service, that would be the bug report itself. For an LLM call, it&apos;s the default
        behavior, which makes a bug report of &quot;it did the wrong thing once&quot; genuinely
        harder to chase than the traditional version of the same complaint.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Setting temperature to zero while debugging narrows the variance without eliminating it
        entirely, and it&apos;s worth doing specifically so a fix can be checked against something
        closer to a fixed target. What actually makes a report investigable, though, is the trace
        from the first section existing at all: the exact request, exact model version, exact
        parameters, and exact retrieved context that produced the one bad answer, captured at the
        time it happened, because getting the identical output again on demand often isn&apos;t
        possible even with temperature at zero.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Tracking model and prompt version alongside every trace turns a vague &quot;it got worse
        recently&quot; into an answerable question: compare traces from before and after a specific
        deploy, against the same golden set this series has already built a habit of running, and
        see whether the scores actually moved.
      </p>
    </section>
  );
}
