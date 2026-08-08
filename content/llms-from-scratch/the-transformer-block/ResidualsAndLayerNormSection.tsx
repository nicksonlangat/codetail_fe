export function ResidualsAndLayerNormSection() {
  return (
    <section>
      <h2
        id="residual-connections-and-layer-norm"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Residual connections and layer norm: why deep stacks don&apos;t collapse
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The obvious way to wire two sublayers together is to just replace: feed the input into
        attention, take attention&apos;s output, feed that straight into feedforward, pass the
        result to the next block. Stack that 96 times and training breaks. A gradient flowing
        backward through 96 consecutive transformations shrinks or explodes long before it reaches
        the earliest blocks, the same vanishing-gradient problem that made very deep networks
        untrainable before this fix existed.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The fix is the <strong>residual connection</strong>: add the sublayer&apos;s input back
        onto its output instead of replacing it, so <code>output = input + sublayer(input)</code>.
        The sublayer now only has to learn the correction to make, an increment on top of what
        came in, rather than learning to reconstruct and preserve everything unrelated while also
        computing something new. And that addition has a gradient of exactly 1 with respect to the
        input, so the gradient signal always has a direct, unobstructed path backward through
        every one of those 96 additions. The sublayers themselves become optional detours on the
        gradient&apos;s shortest way home, not the only road.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <strong>Layer normalization</strong> handles a different problem the residual stream
        creates. Every addition piles another sublayer&apos;s output on top of the running total,
        and unnormalized, that total drifts to arbitrarily large magnitudes 96 additions deep.
        Layer norm takes one token&apos;s vector, at that point in the stack, and rescales it to
        zero mean and unit variance across its own feature dimension, then applies a small learned
        scale and shift so it isn&apos;t stuck at a fixed statistical shape forever. It normalizes
        per token, across features, not across a batch of examples the way batch normalization
        does, which is what makes it work regardless of how many tokens happen to be in the
        sequence.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        One ordering choice is worth naming: the original transformer paper normalized after each
        sublayer&apos;s addition, now called <strong>post-norm</strong>. Most modern large models,
        and the diagram earlier in this article, normalize before each sublayer instead,{" "}
        <strong>pre-norm</strong>, because it keeps that gradient path even cleaner at very large
        depths and trains more stably without careful learning-rate warmup.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Gotcha:</strong> pre-norm and post-norm aren&apos;t interchangeable defaults.
          Swapping one for the other in an existing architecture without also adjusting the
          learning-rate warmup schedule is a common, quiet way a training run diverges, the loss
          looks fine for a while and then breaks.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Everything in this article assumed each token&apos;s vector already carries some notion of
        where it sits in the sequence. It doesn&apos;t, not on its own, an embedding by itself has
        no position baked in, and attention treats the whole sequence as an unordered set unless
        something adds order back in. Where that positional information actually comes from is
        next.
      </p>
    </section>
  );
}
