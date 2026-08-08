export function AttentionsQuadraticCostSection() {
  return (
    <section>
      <h2
        id="attentions-quadratic-cost"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Attention&apos;s quadratic cost: every token against every token
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s tempting to think a bigger context window is just a bigger number in a config
        file. Double it and you double the cost, the same way doubling a batch size roughly doubles
        training time. That mental model is wrong, and it&apos;s wrong in a way that costs real
        money the moment you put a model into production.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The Attention article established the mechanism: every token computes a query, and that
        query gets compared against the key of every other token in the sequence, including itself.
        For a sequence of length <em>n</em>, that&apos;s <em>n</em> tokens each comparing against{" "}
        <em>n</em> tokens, <em>n</em>&nbsp;&times;&nbsp;<em>n</em> pairwise comparisons, per
        attention head, per layer. Double <em>n</em> and you don&apos;t double the comparisons, you
        roughly quadruple them.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Put actual numbers on it. A prompt of 1,024 tokens needs 1,024&nbsp;&times;&nbsp;1,024, about
        1.05 million pairwise comparisons for one head in one layer. Grow that to 4,096 tokens, a 4x
        increase in length, and it&apos;s 4,096&nbsp;&times;&nbsp;4,096, about 16.8 million
        comparisons, 16x the work for 4x the tokens. Push to a 32,768-token prompt, 32x the original
        length, and it&apos;s roughly 1.07 billion comparisons, 1,024x the original work. That
        1,024x isn&apos;t a coincidence, it&apos;s 32 squared, exactly what &ldquo;quadratic&rdquo;
        predicts.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        And that&apos;s per head, per layer. A real model runs this same arithmetic across every
        attention head in every transformer block, dozens of times over, so the constant multiplier
        in front of <em>n</em>&sup2; is large before the quadratic term even starts dominating. This
        is the direct, mechanical reason a 128K-token context window isn&apos;t just &ldquo;the same
        thing but bigger,&rdquo; it&apos;s a different cost regime entirely, and it&apos;s the first
        of two costs this article covers. The second shows up not when the model reads a long
        prompt, but when it has to keep generating one token at a time afterward.
      </p>
    </section>
  );
}
