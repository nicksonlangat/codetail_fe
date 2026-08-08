export function AlertingForAISpecificFailuresSection() {
  return (
    <section>
      <h2 id="alerting-for-ai-specific-failures" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A generic error rate misses most of what actually goes wrong here
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A 500 error rate alert catches a model API being down. It catches almost nothing else that
        actually goes wrong in an LLM application, because most of the failure modes covered across
        this series don&apos;t throw an error, they return a confident, well-formed, wrong answer.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A few signals worth alerting on specifically. The cascade escalation rate from Latency,
        Cost, and Streaming, a sudden jump means either traffic got harder or the cheap model
        regressed, both worth knowing immediately rather than noticing in next month&apos;s cost
        report. Eval scores against a sample of real production traffic, scored the same way as
        the golden set, to catch drift that a static test suite run only in CI will never see,
        since it only ever tests the same fixed cases. Tool-call failure rate tracked separately
        from model-call failure rate, since a tool failing and a model failing point at completely
        different parts of the system and need different people paged.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        None of these replace the tracing from the first section, they&apos;re what tells you to go
        look at a trace in the first place, instead of finding out from a user complaint three
        months from now.
      </p>
    </section>
  );
}
