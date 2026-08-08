export function EmbeddingModelChoiceSection() {
  return (
    <section>
      <h2 id="choosing-an-embedding-model" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Switching embedding models later means re-embedding everything
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        An embedding model turns a chunk of text into a vector, and the choice of which one to
        use trades off a few things worth deciding on purpose: higher dimension counts capture
        more nuance at the cost of storage and query time, and a model trained on general web text
        performs differently than one tuned for code, legal documents, or medical text, sometimes
        significantly.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The costly mistake isn&apos;t picking the wrong model, it&apos;s not realizing the
        decision is hard to reverse. Vectors from two different embedding models don&apos;t share
        a coordinate space, a query embedded with model A has no meaningful distance to a document
        embedded with model B. Switching models isn&apos;t a config change, it&apos;s
        re-embedding your entire corpus from scratch, which on a large document store is a real
        migration, not an afternoon&apos;s work.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Evaluate the embedding model against your actual queries and your actual documents before
        committing, the same way the chunking strategy above gets tuned empirically, not chosen
        off a benchmark leaderboard that may not resemble your content at all.
      </p>
    </section>
  );
}
