export function EmergentAbilitiesSection() {
  return (
    <section>
      <h2 id="emergent-abilities" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        What &ldquo;emergent&rdquo; abilities are, and reason for skepticism about the term
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Around 2021 and 2022, researchers noticed something that looked genuinely strange. Test
        models of increasing size on tasks like three-digit multiplication or certain multi-step
        reasoning benchmarks, and small and mid-sized models score at essentially random chance, flat
        near zero no matter how much bigger you make them within that range. Then, at some threshold
        of scale, accuracy jumps, not gradually, sharply, from near-zero to well above chance within
        a relatively narrow band of model size. That was named an <strong>emergent ability</strong>:
        a capability the smaller versions of the model simply did not have, that the larger version
        does, with no smooth ramp in between.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s an unsettling idea if you take it at face value. The scaling law from the first
        section of this article says loss falls smoothly and predictably with scale, no jumps
        anywhere. If specific abilities can appear suddenly and unpredictably at some scale you
        haven&apos;t reached yet, that means you cannot actually predict what a bigger model will be
        able to do just by extrapolating a curve, which undercuts a lot of what makes scaling laws
        useful for planning in the first place.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Gotcha:</strong> a 2023 paper, &ldquo;Are Emergent Abilities of Large Language
          Models a Mirage?&rdquo;, re-ran the same experiments with a different metric and the sharp
          jumps mostly disappeared. The underlying model wasn&apos;t doing anything different. The
          metric was.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Here&apos;s the mechanism. Most of the tasks that showed &ldquo;emergence&rdquo; were scored
        with a discontinuous metric: exact-match accuracy on a multi-step problem, right or wrong,
        nothing in between. Multiply two three-digit numbers and get every single digit correct or
        the whole answer counts as a miss, there&apos;s no partial credit for getting four out of
        five digits right. A model that&apos;s slowly, smoothly improving its per-token accuracy will
        look completely flat on that metric for a long stretch, because getting one digit wrong in a
        five-digit answer still scores zero, right up until it crosses the point where it reliably
        gets all five digits right, at which point the score jumps from near-zero to near-100% almost
        immediately. The underlying skill was improving the entire time. The ruler just couldn&apos;t
        show it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Swap exact-match accuracy for a continuous metric on the exact same tasks, like per-token
        cross-entropy loss or the probability the model assigned to each correct digit, and the curve
        stops looking like a cliff. It looks like a smooth, gradual improvement across model scale,
        the same shape as the loss-versus-compute line from the first section of this article. The
        capability wasn&apos;t emerging out of nowhere. It was there the whole time, moving gradually,
        and a metric with a hard pass or fail threshold was hiding the gradient from you.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This doesn&apos;t mean nothing surprising ever happens at scale, and it doesn&apos;t mean
        every claimed emergent ability is purely a metric artifact, some cases are genuinely more
        subtle than a single discontinuous benchmark. But the more skeptical reading, that a lot of
        &ldquo;sudden capability jumps&rdquo; are the predictable output of a smooth underlying trend
        run through an unforgiving pass or fail scorer, is now the better-supported one. It&apos;s
        also a useful habit generally: before concluding a system did something qualitatively new,
        check whether the metric you&apos;re reading is capable of showing you a gradual change in
        the first place.
      </p>
    </section>
  );
}
