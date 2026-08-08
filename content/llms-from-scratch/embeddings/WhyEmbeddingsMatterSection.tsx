export function WhyEmbeddingsMatterSection() {
  return (
    <section>
      <h2 id="why-embeddings-matter" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Learned, not designed
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The toy space earlier in this article was hand-placed, so the clustering could be
        guaranteed for the demo. Real embedding tables are not designed by anyone. Every one of
        those numbers starts as a small random value, and training slowly adjusts them, millions of
        times, using the exact same next-token-prediction objective from the first article in this
        series. If moving &ldquo;cat&rdquo; slightly closer to &ldquo;kitten&rdquo; helps the model
        predict training text more accurately, that adjustment happens. If it doesn&apos;t help, it
        doesn&apos;t. The clustering you saw is an emergent side effect of optimizing prediction
        accuracy, nobody writes a rule that says animals belong near other animals.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Real embeddings are also far larger than the two dimensions used above. GPT-2&apos;s
        smallest version uses 768 numbers per token. GPT-3&apos;s largest version uses 12,288. More
        dimensions mean more independent directions available to encode independent relationships,
        gender, tense, sentiment, topic, formality, and thousands of others, all at once, in the
        same vector, without those relationships interfering with each other the way they would if
        forced into two dimensions.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> the embedding table is usually the single largest chunk of
          parameters in a small language model. A 50,000-token vocabulary at 768 dimensions is
          38.4 million numbers, just to represent &ldquo;which token is this&rdquo; before any
          actual reasoning happens.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        None of this explains yet how a vector actually gets adjusted, what &ldquo;training&rdquo;
        does mechanically to a number inside it, or how a network built from these vectors makes a
        decision at all. That requires stepping back from language specifically and looking at the
        machinery underneath: neurons, weights, and the matrix multiplications that turn one vector
        into another. That&apos;s next.
      </p>
    </section>
  );
}
