export function WhenBetterPromptingWinsSection() {
  return (
    <section>
      <h2 id="when-better-prompting-wins-outright" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The honest cost comparison almost always favors prompting first
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A prompt change ships in minutes and reverts in minutes. Fine-tuning requires a real
        dataset, which means someone building it carefully, a training run, a full pass through
        the golden set, and a plan for retraining every time requirements shift, because a
        fine-tuned model doesn&apos;t absorb a new instruction the way a prompt does, it needs new
        examples and a new run.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That cost is worth paying when prompting has genuinely been tried and genuinely
        can&apos;t hold the behavior reliably enough, a format that needs to be exactly right on
        every single call at a volume where the occasional prompt-following slip is unacceptable,
        or a cost and latency target that only a smaller, specialized model can hit. It&apos;s not
        worth paying because a prompt felt fragile after one round of iteration, or because fine-
        tuning sounds like the more serious, production-grade choice.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The bar worth holding: prompting and RAG have both been genuinely exhausted for this
        specific problem, and there&apos;s a real dataset and a real appetite to maintain a
        fine-tuned model going forward, not just for the one time it gets trained.
      </p>
    </section>
  );
}
