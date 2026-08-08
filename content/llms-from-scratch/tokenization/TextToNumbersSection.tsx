export function TextToNumbersSection() {
  return (
    <section>
      <h2 id="text-to-numbers" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Why raw text can&apos;t be fed to a neural network
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The previous article treated the model as a function from &ldquo;tokens so far&rdquo; to
        &ldquo;probability of the next token.&rdquo; That glossed over a real problem: a neural
        network is a stack of matrix multiplications. It only accepts numbers. The word
        &ldquo;cat&rdquo; is not a number, so before any of the math from the rest of this series
        can happen, every piece of text has to become a sequence of integers first. That conversion
        step is <strong>tokenization</strong>, and the choices made here quietly shape almost every
        weird thing a language model does later.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">The obvious approaches, and why both fail</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The first idea most people have is: assign every whole word a number. &ldquo;cat&rdquo; is
        1, &ldquo;dog&rdquo; is 2, and so on. This is called <strong>word-level tokenization</strong>,
        and it breaks immediately for two reasons. First, English has hundreds of thousands of
        words, plus names, typos, slang, and made-up words a model will see for the first time at
        inference. Any word not in the fixed list has no number to become, that&apos;s the{" "}
        <strong>out-of-vocabulary problem</strong>. Second, &ldquo;run&rdquo;, &ldquo;runs&rdquo;,
        &ldquo;running&rdquo;, and &ldquo;runner&rdquo; would each need their own separate entry,
        with no way for the model to know they share a root.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The opposite idea is: assign every individual character a number. &ldquo;c&rdquo; is 1,
        &ldquo;a&rdquo; is 2, &ldquo;t&rdquo; is 3. This fixes the out-of-vocabulary problem
        completely, there are only a few dozen characters, so nothing is ever unseen. But it
        creates a new one: sequences get very long. A model has a fixed limit on how many tokens
        it can look at once, spending that entire budget one character at a time means far less
        actual content fits, and the model has to work much harder to learn that
        &ldquo;c&rdquo;-&ldquo;a&rdquo;-&ldquo;t&rdquo; means the same thing every time it appears,
        instead of just being handed &ldquo;cat&rdquo; as a single unit.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: tokenization is a tradeoff between vocabulary size and sequence length. Fewer, larger
          tokens means shorter sequences but more out-of-vocabulary risk. More, smaller tokens means
          no out-of-vocabulary risk but much longer sequences. Every production tokenizer picks a
          point between the two extremes.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The answer every modern LLM converged on sits in between: break words into common
        <strong> subword</strong> pieces. &ldquo;running&rdquo; might become &ldquo;run&rdquo; plus
        &ldquo;ning&rdquo;. Common whole words stay as one token, rare or unseen words fall back to
        smaller, still-meaningful chunks, and there&apos;s never a word the tokenizer simply cannot
        represent. The algorithm that builds this middle-ground vocabulary is called{" "}
        <strong>byte-pair encoding</strong>, covered next.
      </p>
    </section>
  );
}
