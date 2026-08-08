export function WhenSimilarityLiesSection() {
  return (
    <section>
      <h2 id="when-similarity-search-misleads" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Similar in meaning isn&apos;t the same as useful for answering the question
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A query about &quot;how do I enable two-factor authentication&quot; and a document titled
        &quot;why we don&apos;t recommend two-factor authentication for this feature&quot; sit
        close together in vector space, they&apos;re about the same topic, using much of the same
        vocabulary. Semantically similar and actually useful for answering the question are
        different properties, and embedding similarity only measures the first one.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This is the gap that makes retrieval quality feel inconsistent even when every other piece
        is tuned well: good chunking, a well-chosen embedding model, a fast index, and the top
        result is still, on some fraction of queries, topically related but substantively wrong.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Vector similarity is a cheap first pass over a large corpus, not a precision instrument.
        Treating its output as the final answer instead of a shortlist is the mistake. The next
        article in this series covers reranking, a second, more precise pass over a much smaller
        candidate set, as the actual fix for this gap.
      </p>
    </section>
  );
}
