import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ChunkingSection() {
  return (
    <section>
      <h2 id="chunking-strategy" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        How you split a document decides what retrieval can ever find
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Before anything gets embedded, it gets chunked, split into pieces small enough to embed
        and retrieve individually. Get the split wrong and no amount of tuning downstream fixes
        it, because the damage happened before the first vector was ever computed.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Splitting on a fixed character count, wherever it happens to land
        </p>
        <CodeBlock
          code={`def naive_chunk(text, size=500):
    return [text[i:i + size] for i in range(0, len(text), size)]`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This slices mid-sentence, mid-code-block, mid-table-row, wherever the 500th character
        happens to fall. A chunk that ends &quot;the answer is 4&quot; and starts the next chunk
        with &quot;2, because...&quot; embeds as two unrelated fragments, and retrieval has no way
        to know they were ever one thought.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The fix is splitting on the document&apos;s actual structure, paragraph breaks, headings,
        function boundaries in code, with a target size range instead of a hard cutoff, and a
        small overlap between adjacent chunks so a sentence spanning a boundary still appears
        whole in at least one of them.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Both directions can fail. Too small, and a chunk reading just &quot;42&quot; embeds with
        no context about what question it answers. Too large, and a chunk covering five different
        subtopics embeds as a vague average of all of them, scoring mediocre similarity against
        queries about any single one. The right size depends on the content, dense reference
        material wants smaller chunks than narrative prose, which is exactly why this step gets
        tuned empirically against real queries, not decided once and left alone.
      </p>
    </section>
  );
}
