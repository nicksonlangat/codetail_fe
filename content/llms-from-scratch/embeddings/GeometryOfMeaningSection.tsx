import { EmbeddingSpace } from "@/components/blog/interactive/embedding-space";

export function GeometryOfMeaningSection() {
  return (
    <section>
      <h2 id="geometry-of-meaning" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Distance and direction become meaning
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Once every token is a point in space, two geometric properties of that space start doing
        real work. The first is distance: words used in similar contexts during training end up
        positioned near each other, because the training process repeatedly nudges a word&apos;s
        vector toward the vectors of words it tends to appear alongside. &ldquo;Cat&rdquo; and
        &ldquo;kitten&rdquo; show up in similar sentences constantly, so their vectors converge.
        &ldquo;Cat&rdquo; and &ldquo;refrigerator&rdquo; almost never do, so theirs stay far apart.
        Nobody tells the model cats and kittens are related, it falls out of which words keep
        appearing near which other words.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The second property is direction, and it is stranger: consistent relationships between
        words tend to show up as consistent directions in the space, not just consistent neighbors.
        The most famous illustration, from the original word2vec research in 2013, is that
        subtracting the vector for &ldquo;man&rdquo; from &ldquo;king,&rdquo; then adding
        &ldquo;woman,&rdquo; lands close to the vector for &ldquo;queen.&rdquo; The &ldquo;royal to
        commoner&rdquo; step and the &ldquo;male to female&rdquo; step behave like directions you can
        apply, not just labels on individual points.
      </p>

      <EmbeddingSpace />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The space above is hand-built in two dimensions so it fits on screen, real embeddings live
        in hundreds of dimensions and are never this tidy. But the two properties it demonstrates
        are real: click through the words and notice each one&apos;s nearest neighbors come from its
        own conceptual cluster, animals near animals, fruits near fruits, royalty terms near each
        other, without anyone labeling the clusters by hand. Then switch to vector arithmetic and
        watch <span className="font-mono">king - man + woman</span> land on{" "}
        <span className="font-mono">queen</span>.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> analogy arithmetic like this is a genuinely observed property
          of trained embedding spaces, not a hand-scripted demo trick, but it is also imperfect and
          inconsistent across word pairs and across different trained models. Treat it as evidence
          that embeddings capture real structure, not as something you can rely on for every analogy
          you try.
        </p>
      </div>
    </section>
  );
}
