export function LanguageModelDefinedSection() {
  return (
    <section>
      <h2 id="language-model-defined" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        What a language model actually is
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Most explanations describe a language model as something that "understands" text, or a
        database of facts it "remembers." Both are wrong in ways that will confuse you later,
        when the model confidently states something false or forgets what you told it two
        messages ago. Neither behavior makes sense if you think of it as a knowledge store.
        Both make complete sense once you know what it actually is.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A language model is a function. Give it a sequence of tokens, it gives you back a
        probability distribution over what token comes next. That is the entire definition.
        Everything else, chat interfaces, code generation, reasoning-looking output, is built
        on top of calling that function over and over.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          A language model is a next-word guesser, extraordinarily well trained. Not a search
          engine. Not a fact database. A function from "text so far" to "probability of what
          comes next."
        </p>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Making that concrete</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Take the sentence "The cat sat on the ___". A trained model does not know, in any factual
        sense, what the cat sat on. It has seen enormous amounts of text where sentences like this
        one are completed with words like <em>mat</em>, <em>floor</em>, or <em>couch</em>, far
        more often than with words like <em>moon</em> or <em>equation</em>. So it assigns
        <em> mat</em> a high probability, <em>floor</em> a lower but still meaningful one, and
        <em> moon</em> something close to zero. That ranked list of probabilities is the model's
        entire output for this step.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Try it below. Pick a prompt and watch the distribution. Notice that "2 + 2 =" gets a
        sharply confident answer, not because the model computed the sum, but because virtually
        every training example that looks like that sentence was completed the same way. Rule:
        confidence in a language model's output reflects how consistently the training data
        completed a similar pattern, not whether the model verified anything.
      </p>
    </section>
  );
}
