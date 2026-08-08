import { AttentionExplorer } from "@/components/blog/interactive/attention-explorer";

export function WorkedExampleSection() {
  return (
    <section>
      <h2 id="worked-example" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Tracing the arithmetic by hand
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Below is a real, checkable run of the three steps above on the sentence &ldquo;The cat
        sat,&rdquo; using small 4-dimensional toy vectors and fixed weight matrices, chosen so every
        number is easy to verify by hand rather than learned from actual training data. Pick which
        token is doing the &ldquo;looking,&rdquo; the query, and watch the attention weights and
        output vector update.
      </p>

      <AttentionExplorer />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Notice what happens with &ldquo;sat&rdquo; as the query. Its toy vector shares one dimension
        with &ldquo;The&rdquo; and a different dimension with &ldquo;cat,&rdquo; so it ends up
        splitting its attention almost evenly between them, roughly 27% each, while still keeping
        the largest share, about 45%, on itself. Nothing about that split was hand-scripted, it
        falls directly out of the dot products between the actual vectors, exactly the same
        arithmetic that would run on real learned embeddings at a much larger scale.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> this demo fixes the query and key weight matrices to the
          identity, so a token&apos;s query and key are just its raw embedding, purely so the dot
          products stay traceable by hand. A real model learns all three weight matrices during
          training, and the resulting query and key vectors look nothing like the raw embeddings
          they started from.
        </p>
      </div>
    </section>
  );
}
