import { BpeTokenizer } from "@/components/blog/interactive/bpe-tokenizer";

export function TokenizerPlaygroundSection() {
  return (
    <section>
      <h2 id="tokenizer-playground" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Watching the merges happen
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Below is a real byte-pair encoding algorithm, running with a small, hand-built set of 32
        merge rules instead of the tens of thousands a real tokenizer would learn from a full
        training corpus. Pick a word, step through the merges one at a time, and watch individual
        characters fuse into the subword chunks the algorithm has learned to recognize.
      </p>

      <BpeTokenizer />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Notice that <span className="font-mono text-brand-text">strawberry</span> collapses cleanly
        into <span className="font-mono text-brand-text">straw</span> and{" "}
        <span className="font-mono text-brand-text">berry</span>, and{" "}
        <span className="font-mono text-brand-text">tokenization</span> collapses into{" "}
        <span className="font-mono text-brand-text">token</span>,{" "}
        <span className="font-mono text-brand-text">iz</span>,{" "}
        <span className="font-mono text-brand-text">ation</span>. Now try{" "}
        <span className="font-mono text-brand-text">internationalization</span>. It comes apart
        into a messier mix, several single characters mixed in with real chunks like{" "}
        <span className="font-mono text-brand-text">er</span> and{" "}
        <span className="font-mono text-brand-text">ation</span>. That is not a bug in the demo.
        This toy vocabulary only knows 32 merge rules. A real tokenizer, with tens of thousands of
        learned merges built from a training corpus containing that exact word many times over,
        would very likely have a dedicated chunk for it. The lesson generalizes: how cleanly a word
        splits depends entirely on how well-represented it was in whatever text the tokenizer&apos;s
        merges were learned from.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: a word does not have one true tokenization. It has whatever tokenization falls out
          of applying one specific tokenizer&apos;s specific learned merge rules, in order. Change
          the tokenizer, change the split.
        </p>
      </div>
    </section>
  );
}
