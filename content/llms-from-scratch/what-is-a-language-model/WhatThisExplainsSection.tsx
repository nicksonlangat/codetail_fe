const MISCONCEPTIONS = [
  {
    claim: "It looked up the answer.",
    reality:
      "There is no lookup step at inference time. Every fact-shaped output is a token sequence the model judged probable, based on patterns in training data. It often happens to be correct, because correct completions were common in that data. It is never verified against a source while generating.",
  },
  {
    claim: "It made up a fact because it was broken.",
    reality:
      "Hallucination and correct output come from the exact same mechanism: predicting a plausible next token. The model has no separate 'I don't know' pathway unless it was specifically trained to produce one. A fluent, confident, wrong sentence and a fluent, confident, right sentence look identical from the inside.",
  },
  {
    claim: "It remembers our earlier conversation.",
    reality:
      "Nothing persists between calls to the model itself. Each time you send a message, the entire visible conversation is re-fed in as input tokens. 'Memory' in a chat product is the application re-sending prior messages, not the model recalling anything.",
  },
  {
    claim: "It reasons through problems step by step.",
    reality:
      "What looks like reasoning is the model predicting tokens that resemble reasoning, because its training data contained huge amounts of worked-through reasoning. Writing out intermediate steps measurably improves the final answer's accuracy, that's real and useful, but it's still next-token prediction at every step, not a separate logic engine running underneath.",
  },
];

export function WhatThisExplainsSection() {
  return (
    <section>
      <h2 id="what-this-explains" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        What this explains, and what it doesn't
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Once "next-token prediction" is the model you actually hold in your head, a lot of
        confusing LLM behavior stops being confusing. It becomes predictable, because you can ask
        a sharper question: "what would a plausible continuation of this text look like," instead
        of "does the model know this."
      </p>

      <div className="space-y-3 mb-6">
        {MISCONCEPTIONS.map(({ claim, reality }) => (
          <div key={claim} className="bg-white border border-brand-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-brand-border bg-brand-surface/30">
              <span className="text-[12px] font-semibold text-brand-text">&ldquo;{claim}&rdquo;</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[12px] text-brand-text-muted">{reality}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Then why does this feel like more than autocomplete?
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Fair question. Your phone's keyboard also predicts the next word, and nobody confuses it
        for something intelligent. The difference is scale and depth: a phone keyboard looks at
        the last one or two words and a tiny model. A large language model looks at thousands of
        tokens of context, was trained on a meaningful fraction of publicly available text, and
        runs that prediction through a network with billions of tuned parameters. The objective
        stayed exactly the same, predict the next token, but at sufficient scale, getting that
        objective right on enough diverse text requires the model to internalize grammar, facts,
        style, and multi-step patterns well enough to reproduce them. Nobody designed those
        capabilities in directly. They fell out of the objective once the scale was large enough.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> when an LLM gets something wrong, the useful question is
          not "why is it broken," it's "what completion pattern in its training data would produce
          this." That question actually has an answer, and it's the mental model this entire
          series is built on.
        </p>
      </div>
    </section>
  );
}
