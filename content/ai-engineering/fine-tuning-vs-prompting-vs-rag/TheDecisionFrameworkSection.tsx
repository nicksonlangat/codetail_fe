export function TheDecisionFrameworkSection() {
  return (
    <section>
      <h2 id="the-decision-framework" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Three tools for three different problems, not three tiers of the same one
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        These three get compared as if they were ranked options, prompting for beginners, RAG for
        intermediate, fine-tuning for serious production use. They&apos;re not a ladder. They
        solve different problems, and the honest first question is which problem you actually
        have.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Changing behavior, format, or tone, and doing it fast, with the ability to change your
        mind tomorrow, is prompting&apos;s job, covered in Prompting as Interface Design earlier
        in this series. Grounding answers in facts that live in a specific corpus and change over
        time is RAG&apos;s job, covered two articles ago, along with an honest account of when
        it&apos;s the wrong tool. Fine-tuning is neither of those. It earns its place only when
        the model&apos;s default behavior itself needs to shift in a way prompting can&apos;t
        reach reliably, or when cost and latency justify replacing a long prompt on a large model
        with a short one on a smaller, specialized one.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Most teams that reach for fine-tuning first haven&apos;t actually exhausted the first two.
        The rest of this article is about what fine-tuning is actually for, so that reach is a
        decision, not a reflex.
      </p>
    </section>
  );
}
