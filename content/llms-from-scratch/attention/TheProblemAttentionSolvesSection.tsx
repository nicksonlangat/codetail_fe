export function TheProblemAttentionSolvesSection() {
  return (
    <section>
      <h2 id="the-problem-attention-solves" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The problem a feedforward layer can&apos;t solve
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Take the sentence: &ldquo;The trophy didn&apos;t fit in the suitcase because it was too
        big.&rdquo; What does &ldquo;it&rdquo; refer to, the trophy or the suitcase? Any fluent
        English speaker says the trophy, instantly. Now change one word: &ldquo;because it was too
        small,&rdquo; and &ldquo;it&rdquo; flips to the suitcase. Same grammatical structure, same
        position in the sentence, opposite answer, because the correct resolution depends on
        meaning carried by a word all the way at the other end of the sentence.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The neural network layers from the previous article can&apos;t do this. A feedforward layer
        processes each position with the same fixed weights every time, it has no built-in way to
        look at a different position and ask &ldquo;what did that word mean, and is it relevant to
        me.&rdquo; Earlier architectures tried processing a sentence one word at a time in order,
        recurrent neural networks, carrying a running summary forward. That summary had to compress
        everything seen so far into one fixed-size vector, and by the time a long sentence reached
        its end, details from the beginning had faded, the same way a rumor loses detail after
        passing through ten people.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          A language model is a next-word guesser, extraordinarily well trained. Attention is the
          part that lets it check its work against every earlier word directly, instead of relying
          on a single compressed summary that degrades with distance.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        <strong>Attention</strong> replaces that compressed summary with direct access. Every token
        gets to look at every other token in the sequence, regardless of how far apart they are, and
        decide, numerically, how relevant each one is. &ldquo;It&rdquo; can reach directly back to
        &ldquo;trophy&rdquo; or &ldquo;suitcase,&rdquo; whichever one the rest of the sentence
        actually points to, with no fading and no fixed compression bottleneck in between. This one
        mechanism, more than any other single idea, is why transformers replaced recurrent networks
        for language.
      </p>
    </section>
  );
}
