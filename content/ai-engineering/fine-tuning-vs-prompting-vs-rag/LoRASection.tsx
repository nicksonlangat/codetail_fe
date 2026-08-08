export function LoRASection() {
  return (
    <section>
      <h2 id="lora-and-instruction-tuning-practically" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        What most people mean by &quot;we fine-tuned a model&quot;
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Full fine-tuning, updating every weight in the model, is expensive enough in compute and
        infrastructure that it&apos;s mostly done by the labs training foundation models
        themselves, not by a team building a product on top of one.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        LoRA, low-rank adaptation, is what almost everyone actually means when they say they fine-
        tuned a model. The base model stays frozen, untouched, and a small set of additional
        parameters gets trained on top of it, dramatically cheaper to train and to store, since
        you&apos;re saving a small adapter file rather than a full copy of the model&apos;s
        weights.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The practical workflow is a few hundred to a few thousand high-quality examples of the
        exact behavior you want, more isn&apos;t automatically better if the examples are
        inconsistent with each other, a training run against those examples, and then the same
        golden-set evaluation from earlier in this series, run against the fine-tuned model the
        same way it would run against a prompt change. A fine-tuned model is still a model
        producing output that needs checking, not a graduation past needing evals.
      </p>
    </section>
  );
}
