export function WhySelfAttentionMattersSection() {
  return (
    <section>
      <h2 id="why-self-attention-matters" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        One head isn&apos;t enough, and the cost that creates
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A single set of query, key, and value matrices can only learn one notion of
        &ldquo;relevant.&rdquo; Real transformers run several of these in parallel, each with its
        own independently learned Q, K, and V matrices, called <strong>attention heads</strong>.
        One head might end up specializing in pronoun resolution, another in tracking which verb
        goes with which subject across a long clause, another in something with no clean linguistic
        name at all. Their outputs get concatenated and combined afterward. Nobody assigns heads
        their specialty, it falls out of training the same way embedding clusters did.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This power isn&apos;t free. Computing attention means comparing every token&apos;s query
        against every token&apos;s key, a sequence of length <em>n</em> requires roughly{" "}
        <em>n</em>&sup2; comparisons. Double the length of the text a model reads at once, and the
        attention computation roughly quadruples. This is the direct, mechanical reason context
        windows have real limits and real cost, not a policy decision, a consequence of the
        arithmetic covered in this article, explored in full in the Context Windows and KV Cache
        article later in this series.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: attention cost scales with the square of sequence length, not linearly. That single
          fact explains why long-context models are a genuine engineering challenge, not just a
          matter of buying more memory.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6">
        Attention alone is just a weighted average, though, a linear combination of value vectors.
        Recall from the neural network article that stacking linear operations without anything
        nonlinear in between collapses into one linear operation. Attention needs a feedforward
        layer, activation function included, sitting right after it in the same block to actually
        build something new. How those two pieces, attention and feedforward, get assembled together
        with residual connections and normalization into the repeating unit used throughout a real
        model is <strong>the transformer block</strong>, covered next.
      </p>
    </section>
  );
}
