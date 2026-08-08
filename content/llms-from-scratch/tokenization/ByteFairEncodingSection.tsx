import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ByteFairEncodingSection() {
  return (
    <section>
      <h2 id="byte-pair-encoding" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Byte-pair encoding: building a vocabulary from scratch
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Byte-pair encoding, BPE, is the algorithm behind the tokenizer in GPT, Llama, and most other
        modern LLMs. The idea is almost embarrassingly simple. Start by treating every piece of text
        as individual characters. Then repeatedly find the pair of adjacent symbols that occurs most
        often across the training text, and merge that pair into a single new symbol. Repeat that,
        thousands of times. Whatever chunks survive as frequent, recurring pairs become entries in
        the vocabulary.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Nobody hand-writes rules like &ldquo;-ing is a suffix.&rdquo; The algorithm never sees
        grammar. It only ever counts how often two symbols sit next to each other and merges the
        winner. Run it on enough English text and &ldquo;-ing&rdquo;, &ldquo;-tion&rdquo;, and
        &ldquo;un-&rdquo; end up as vocabulary entries anyway, because they really do recur that
        often. The linguistic structure falls out of frequency counting, it isn&apos;t built in.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The training loop, stripped to its essence
        </p>
        <CodeBlock
          code={`# Start: every word is a sequence of individual characters
vocab = set(all_characters_in_corpus)
sequences = [list(word) for word in corpus]

for _ in range(num_merges):
    pair_counts = count_adjacent_pairs(sequences)
    most_common_pair = max(pair_counts, key=pair_counts.get)
    sequences = merge_everywhere(sequences, most_common_pair)
    vocab.add("".join(most_common_pair))

# After num_merges rounds, vocab contains characters,
# common subwords, and whole common words, all together`}
          output={``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Two things matter about the result. First, the number of merge rounds is a hyperparameter
        chosen before training. GPT-style tokenizers typically run on the order of tens of thousands
        of merges, ending with a vocabulary around 50,000 to 100,000 entries. Second, every merge
        rule is applied in the exact order it was learned, highest-frequency merges first. That
        ordering is itself part of the tokenizer, applying the same merges in a different order
        produces a different split.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted italic">
          In practice: because the vocabulary is built by merging whatever is frequent in the
          training corpus, a tokenizer trained mostly on English text ends up with common English
          morphemes as single tokens, while less-represented languages and scripts get chopped into
          far more, smaller pieces. That difference in token efficiency is real and has real cost
          implications, more on that at the end of this article.
        </p>
      </div>
    </section>
  );
}
