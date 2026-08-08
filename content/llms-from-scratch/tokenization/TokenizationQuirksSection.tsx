const MISCONCEPTIONS = [
  {
    claim: '"How many r\'s are in strawberry" should be trivial for an LLM.',
    reality:
      'The model never sees "s-t-r-a-w-b-e-r-r-y" as ten letters. It sees whatever tokens its tokenizer produced, maybe "straw" and "berry", maybe something else entirely depending on the tokenizer. Counting letters inside a token requires the model to have memorized that specific token\'s spelling from training data, it cannot just look. That is why letter-counting questions are unreliable in a way that feels bizarre until you know what the model is actually looking at.',
  },
  {
    claim: "A model that's bad at arithmetic on big numbers must have weak reasoning.",
    reality:
      'Numbers get tokenized too, and not always digit by digit. Depending on the tokenizer, "1234" might be one token, or split as "12" and "34", or some other chunking entirely, and that chunking is not guaranteed to be consistent across every number. Arithmetic requires reliably tracking place value across digits. If the tokenizer hands the model an inconsistent chunking of the same-shaped number from one occurrence to the next, arithmetic gets harder for reasons that have nothing to do with the model\'s reasoning ability.',
  },
  {
    claim: "Token count and word count are basically the same thing.",
    reality:
      'For common English words, they are close. For rare English words, code, or non-English text, they are not. A word that is a single token in a well-represented language can require several tokens in a less-represented one, because the tokenizer\'s merges were learned from a training corpus that contained far less of that language. Same sentence, same meaning, different token cost depending on what language it happens to be written in.',
  },
];

export function TokenizationQuirksSection() {
  return (
    <section>
      <h2 id="tokenization-quirks" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        What tokenization quietly explains
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A surprising amount of LLM behavior that gets attributed to "reasoning failures" is actually
        a tokenization artifact. Once you know the model operates on tokens, not characters or
        words, several famous quirks stop being mysterious.
      </p>

      <div className="space-y-3 mb-6">
        {MISCONCEPTIONS.map(({ claim, reality }) => (
          <div key={claim} className="bg-white border border-brand-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30">
              <span className="text-[12px] font-semibold text-brand-text">{claim}</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[12px] text-brand-text-muted">{reality}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">The token, not the word, is the unit of cost</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Every model has a fixed context window, a maximum number of tokens it can process at once,
        and API pricing is charged per token, not per word or character. Both limits are defined in
        terms of whatever the tokenizer produces. This is why a paragraph of dense code or a
        paragraph in a less-represented language can eat noticeably more of a context window than a
        paragraph of plain English of similar length. The tokenizer decided that up front, before the
        model ever saw a single number.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> when a model does something that looks like a reasoning
          failure on short, symbolic, or non-English input, tokenization is worth ruling out first.
          Ask what tokens the input actually became, not what words it started as.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6">
        Once text is a sequence of token IDs, the next question is what the model actually does with
        those IDs internally. An ID is just an index into a lookup table, it carries no meaning by
        itself. Turning that bare integer into something the network can reason over is the job of{" "}
        <strong>embeddings</strong>, next in this series.
      </p>
    </section>
  );
}
