export function WhyAttentionCantTellOrderSection() {
  return (
    <section>
      <h2
        id="why-attention-cant-tell-order"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Why attention alone can&apos;t tell word order
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        &ldquo;The dog bites the man&rdquo; and &ldquo;the man bites the dog&rdquo; use the exact
        same five tokens. As a bag of words they are identical. As sentences they describe two
        different events, and any reader knows immediately which one is the ordinary Tuesday and
        which one is the headline. A language model needs to know the difference too, and it is
        reasonable to assume the attention mechanism from the previous two articles already
        handles this. It doesn&apos;t.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Recall the attention computation: <span className="font-mono">softmax(QK^T / sqrt(d_k))</span>{" "}
        weighting a sum of value vectors. That formula runs on whichever embeddings sit in the
        query, key, and value matrices, it never looks at where in the array a row came from. Feed
        it the embeddings for &ldquo;dog,&rdquo; &ldquo;bites,&rdquo; and &ldquo;man&rdquo; in that
        order, or feed it the same three embeddings in the order &ldquo;man,&rdquo;
        &ldquo;bites,&rdquo; &ldquo;dog,&rdquo; and the dot products between any two specific
        embeddings come out identical either way. Swapping two tokens just permutes which row of
        the value matrix gets summed with which attention weight. The arithmetic itself doesn&apos;t
        change, only the labels attached to the rows do.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Attention is <strong>permutation-equivariant</strong>: shuffle the input tokens, and the
          output vectors shuffle by exactly the same permutation, but every value in every vector
          stays the same. Nothing about the computation changes when order changes, it just relabels
          which output belongs to which position.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This isn&apos;t a theoretical nitpick, it&apos;s the difference between a model that
        understands subject and object and one that treats a sentence as a shuffled deck of words.
        Without some signal telling the model &ldquo;dog&rdquo; came before &ldquo;bites&rdquo; and
        &ldquo;bites&rdquo; came before &ldquo;man,&rdquo; there is nothing in the attention
        computation itself that could recover which noun did the biting. Set aside self-attention
        for a moment and the problem gets even starker: a feedforward layer processes one position
        at a time and has no visibility into other positions at all, so if position isn&apos;t
        encoded into the token representation itself, it is gone by the time any layer sees it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The fix has to happen before attention ever runs. Since the transformer block covered in
        the previous article never mentions position anywhere inside it, attention, feedforward,
        residuals, normalization, the injection point has to be earlier: right at the input
        embedding, once, before the first block even starts. That injected signal is a{" "}
        <strong>positional encoding</strong>, and the rest of this article covers the two ways
        production models build it.
      </p>
    </section>
  );
}
