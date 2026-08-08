export function WhenRAGIsntTheAnswerSection() {
  return (
    <section>
      <h2 id="when-rag-isnt-the-answer" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        RAG is for facts that live in a specific, changing corpus
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        RAG earns its complexity for one specific job: answering from information that lives in
        documents you control and that changes over time, your product docs, your internal wiki,
        this quarter&apos;s policy update. That&apos;s a genuinely different problem from what a
        model already knows, and a genuinely different problem from what fine-tuning solves,
        covered in full later in this series.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s the wrong tool in a few specific shapes that are worth recognizing before
        building the pipeline. A task that&apos;s really about reasoning, working through a
        multi-step problem, doesn&apos;t improve because you handed it more retrieved paragraphs.
        A task that needs broad general knowledge the model already has doesn&apos;t need
        retrieval at all, and adding it just adds latency and a place for irrelevant context to
        creep in. And a task that genuinely needs to synthesize across hundreds of documents at
        once runs into the same context-window ceiling from earlier in this series, retrieval
        narrows the field, it doesn&apos;t remove the limit.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The honest test before reaching for RAG: is the answer actually written down somewhere in
        a document that changes over time, and would a person with access to that document but no
        other context be able to answer the question. If not, retrieval isn&apos;t the missing
        piece.
      </p>
    </section>
  );
}
