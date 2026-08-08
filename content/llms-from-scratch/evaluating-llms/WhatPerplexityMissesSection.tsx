export function WhatPerplexityMissesSection() {
  return (
    <section>
      <h2
        id="what-perplexity-misses"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        What perplexity misses
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A lower perplexity number feels like it should mean a better model, full stop. It
        doesn&apos;t. Perplexity measures exactly one thing: how well a model predicts the next
        token in text that looks statistically like whatever it was trained and tested on.
        That&apos;s a narrow question, and a model can answer it well while failing at nearly
        everything a user actually wants from it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Perplexity says nothing about whether a model can follow an instruction phrased a way
        it&apos;s never seen before. It says nothing about whether a multi-step answer is correct
        or merely fluent. It says nothing about whether the model just invented a citation that
        doesn&apos;t exist. None of that is next-token prediction quality on held-out text, it is
        downstream behavior that a single scalar loss was never designed to capture.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Two models can land within a fraction of a point of each other on perplexity and diverge
        wildly in practice. One follows instructions cleanly, the other ignores half of them. One
        works through a multi-step problem correctly, the other confidently goes wrong at step two.
        This is close to the exact gap between a base model and the instruction-tuned assistant
        built from it, covered in the From Base Model to Assistant article: fine-tuning barely
        moves perplexity on general text, and yet it is the entire difference between a model that
        completes your sentence and one that does what you actually asked.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        If perplexity can&apos;t answer &ldquo;is this model actually useful,&rdquo; something else
        has to. That something is a benchmark suite: a fixed set of tasks with known right answers,
        scored directly on whether the model gets them right.
      </p>
    </section>
  );
}
