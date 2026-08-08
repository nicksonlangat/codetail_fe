import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ANNIndexSection() {
  return (
    <section>
      <h2 id="approximate-nearest-neighbor-search" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Comparing against every vector doesn&apos;t scale, so nobody actually does it
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Finding the closest match to a query vector, exactly, means comparing it against every
        stored vector, one at a time. That&apos;s fine at a thousand documents and unusable at a
        hundred million, so production vector search doesn&apos;t do this at all, it uses an
        approximate nearest neighbor index instead.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Querying an ANN index for the closest 5 chunks
        </p>
        <CodeBlock
          code={`query_vector = embed(user_query)
results = index.query(query_vector, top_k=5)
for r in results:
    print(r.score, r.chunk_id)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Structures like HNSW and IVF organize vectors so a query only has to check a small,
        promising fraction of the total, trading a small amount of recall, occasionally missing
        the true closest match in favor of the second- or third-closest, for a search that
        finishes in milliseconds instead of seconds.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        That tradeoff is almost always worth it. A RAG pipeline retrieving the top five chunks out
        of a few hundred candidates that are all genuinely close rarely notices the difference
        between the true best match and the third-best one. The generation step downstream has a
        much bigger effect on answer quality than whether retrieval found the single mathematically
        closest vector.
      </p>
    </section>
  );
}
