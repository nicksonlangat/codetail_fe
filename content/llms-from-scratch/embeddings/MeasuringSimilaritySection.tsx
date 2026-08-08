import { CodeBlock } from "@/components/blog/interactive/code-block";

export function MeasuringSimilaritySection() {
  return (
    <section>
      <h2 id="measuring-similarity" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        How "close" gets measured
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Saying two vectors are &ldquo;close&rdquo; needs a precise definition, and the one almost
        everyone uses for embeddings is <strong>cosine similarity</strong>: the cosine of the angle
        between two vectors, ignoring their length entirely. Two vectors pointing in exactly the
        same direction score 1. Perpendicular vectors score 0. Opposite directions score -1.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Why ignore length? Because a word that appears far more often in training tends to develop a
        longer vector, purely as a side effect of how many times it got nudged during training, not
        because it is &ldquo;more meaningful.&rdquo; Cosine similarity cares only about direction, so
        it compares meaning without being thrown off by how frequent a word happened to be.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Cosine similarity, computed directly
        </p>
        <CodeBlock
          code={`def cosine_similarity(a, b):
    dot_product = sum(x * y for x, y in zip(a, b))
    magnitude_a = sum(x ** 2 for x in a) ** 0.5
    magnitude_b = sum(y ** 2 for y in b) ** 0.5
    return dot_product / (magnitude_a * magnitude_b)

cosine_similarity(cat_vector, kitten_vector)   # close to 1: similar
cosine_similarity(cat_vector, refrigerator_vector)  # close to 0: unrelated`}
          output={``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Look closely at that formula and note the numerator: a plain dot product between the two
        vectors. That single operation, multiply matching positions and sum the results, is the same
        core computation that shows up again, doing much more sophisticated work, when the
        Attention article covers how a model decides which earlier tokens are relevant to the one it
        is currently processing. Embeddings and attention are not separate mechanisms bolted
        together, attention is built directly on top of the geometry embeddings create.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: cosine similarity measures direction, not magnitude. Two synonyms rarely have
          identical vector lengths, and that&apos;s expected, not a bug.
        </p>
      </div>
    </section>
  );
}
