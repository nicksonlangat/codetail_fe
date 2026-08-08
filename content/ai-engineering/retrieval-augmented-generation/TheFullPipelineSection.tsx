import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TheFullPipelineSection() {
  return (
    <section>
      <h2 id="the-full-pipeline" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Six steps, usually drawn as one box labeled RAG
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Most diagrams show retrieval-augmented generation as a single arrow: question in, grounded
        answer out. Every piece of that arrow is a separate step, built from the last two
        articles, and each one is a place quality can be won or lost independently of the others.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The pipeline, as actual separate steps
        </p>
        <CodeBlock
          code={`def answer_question(query):
    candidates = vector_index.query(embed(query), top_k=50)   # retrieve
    reranked = rerank(query, candidates)[:5]                   # rerank
    context = build_context(reranked)                          # assemble
    return client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Answer using only the provided context."},
            {"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {query}"},
        ],
    )                                                            # generate`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Ingestion and chunking happened earlier, offline, to build the index this function
        queries. Embedding, retrieval, and reranking were the subject of the last article. What&apos;s
        new here is the last step: handing the retrieved context to the model with an explicit
        instruction to answer from it, and what happens when that context isn&apos;t actually
        enough to answer the question.
      </p>
    </section>
  );
}
