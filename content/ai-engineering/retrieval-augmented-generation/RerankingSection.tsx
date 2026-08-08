import { CodeBlock } from "@/components/blog/interactive/code-block";

export function RerankingSection() {
  return (
    <section>
      <h2 id="reranking-the-cheap-way-and-the-real-way" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Retrieve wide and cheap, then rerank narrow and precise
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A cross-encoder, a model that scores a query and a candidate document together rather than
        comparing two precomputed vectors, is more accurate at judging real relevance than
        embedding similarity. It&apos;s also too slow to run against an entire corpus, scoring
        every document takes a full model pass per document, not a vector comparison.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The practical pattern uses both, at different scales. Vector search retrieves a wide net
        of candidates cheaply, fifty rather than five, then a cross-encoder rescoring pass runs
        only against that fifty and picks the true top five to actually send to the model.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Two passes, two different jobs
        </p>
        <CodeBlock
          code={`candidates = vector_index.query(embed(query), top_k=50)  # cheap, wide, approximate
reranked = cross_encoder.score(query, candidates)          # precise, narrow, slower
top_five = sorted(reranked, key=lambda r: r.score, reverse=True)[:5]`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Fifty cross-encoder calls per query is a real cost, but it&apos;s a fixed, bounded one,
        unlike running the same model against a corpus of millions. Whether it&apos;s worth adding
        depends on whether the last article&apos;s similarity-search gap, related but not useful,
        is actually showing up often enough in your own retrieval results to justify it, which is
        exactly the kind of thing the evaluation techniques covered later in this series exist to
        measure rather than guess at.
      </p>
    </section>
  );
}
