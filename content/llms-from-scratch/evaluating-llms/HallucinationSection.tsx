export function HallucinationSection() {
  return (
    <section>
      <h2 id="hallucination" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Why hallucination resists easy detection
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A <strong>hallucination</strong> is a fluent, confident, wrong statement: a case citation
        that doesn&apos;t exist, a function argument that was never in the library, a historical
        date invented wholesale. The instinct is to treat this as a bug, some faulty code path that
        fires under specific conditions and could, in principle, get patched. It isn&apos;t. There
        is no separate hallucination code path to patch.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The Sampling and Generation article covered how every single token a model outputs, correct
        or not, gets produced the same way: sampled from a probability distribution over the whole
        vocabulary, shaped by everything the model learned during training. A hallucinated fact and
        a correct fact come out of the identical mechanism, run the identical arithmetic, at the
        identical layer. There is no internal flag anywhere in the network that reads &ldquo;I am
        making this up right now,&rdquo; because generation never learned to distinguish the two
        cases in the first place.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That is what makes hallucination fundamentally harder to catch than an ordinary software
        bug. A null pointer exception announces itself, a stack trace points at a line number, a
        malformed response fails to parse. A hallucinated citation is syntactically perfect,
        grammatically fluent, formatted exactly like a real one, and produced with the same
        distribution of token probabilities a true statement would have used. There is no error
        signal to catch, because from the model&apos;s perspective nothing went wrong.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Current mitigations reduce the problem without closing it. Retrieval grounding hands the
        model real source documents at generation time so it has actual text to draw from instead of
        only its trained-in weights, cutting down invented facts on questions those documents
        actually cover. Asking a model to cite its sources makes fabrication easier to check
        afterward, though the citations themselves can be invented just as fluently as anything
        else. Uncertainty estimation tries to surface cases where the model&apos;s output
        distribution is unusually flat, a rough proxy for &ldquo;not confident,&rdquo; but a model
        can be catastrophically, uniformly wrong with a sharply peaked distribution too.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Gotcha:</strong> none of these mitigations fully solve hallucination, and
          treating any one of them as a solved problem is a mistake worth avoiding on its own.
          They shift the odds. None of them restores the missing internal signal, because that
          signal was never there to restore.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6">
        This is also why evaluation is genuinely hard, not just tedious. Perplexity measures the
        wrong thing precisely, benchmarks measure the right thing approximately and are gameable,
        and the failure mode users care about most, confident fabrication, doesn&apos;t show up as
        an error signal anywhere in the pipeline. None of that is a reason to stop measuring. It is
        a reason to stay skeptical of any single number, including the ones in this article, and to
        keep asking what a given metric can&apos;t see.
      </p>
    </section>
  );
}
