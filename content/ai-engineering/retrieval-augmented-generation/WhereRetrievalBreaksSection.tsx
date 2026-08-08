export function WhereRetrievalBreaksSection() {
  return (
    <section>
      <h2 id="where-retrieval-quietly-breaks" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        RAG doesn&apos;t remove hallucination, it moves what gets hallucinated about
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        &quot;Grounded in retrieved documents&quot; sounds like it should eliminate made-up
        answers, and it removes exactly one cause of them, the model inventing a fact it never
        actually knew. It does nothing about a second cause: the retrieved context being
        incomplete, mismatched, or subtly wrong, which the model has no way to detect on its own.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Feed the model five chunks that are topically related but don&apos;t actually answer the
        question, the exact failure mode from the last article&apos;s discussion of similarity
        search, and it doesn&apos;t respond &quot;the context doesn&apos;t cover this.&quot; It
        answers anyway, blending whatever the context does say with its own general knowledge,
        confidently, in a single fluent paragraph that reads exactly like a well-grounded answer.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This is a more dangerous failure than a model with no retrieval at all making something
        up, because the presence of citations and retrieved text creates an appearance of rigor
        the answer hasn&apos;t actually earned. A prompt that explicitly permits &quot;say you
        don&apos;t know if the context doesn&apos;t contain the answer&quot; helps, but only if
        the retrieval and reranking steps upstream are actually good enough that most failures are
        rare edge cases, not the everyday result of weak retrieval papered over by a confident
        model.
      </p>
    </section>
  );
}
