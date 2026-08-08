import { ScalingLawCurve } from "@/components/blog/interactive/scaling-law-curve";

export function ScalingLawShapeSection() {
  return (
    <section>
      <h2 id="scaling-law-shape" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The scaling law shape: loss falls predictably with compute
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The popular story about AI progress is that it&apos;s unpredictable, a string of surprise
        breakthroughs nobody saw coming. Model behavior can genuinely surprise you. But the number
        that drives all of it, the loss a model reaches after training, does not. Plot loss against
        the amount of compute spent training the model, on a log-log scale, and it doesn&apos;t
        scatter or plateau unpredictably. It forms a straight line, holding across many orders of
        magnitude of compute, from tiny runs you could do on a laptop to runs costing tens of
        millions of dollars.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A straight line on a log-log plot means one specific thing mathematically: a power law.
        Loss shrinks as compute raised to some small negative exponent, roughly{" "}
        <span className="font-mono">loss ≈ A × compute^(&minus;α)</span>, where A and α are
        constants you fit from actual training runs, not guessed. The Pretraining at Scale article
        gave you the compute formula this α term feeds into,{" "}
        <span className="font-mono">total_flops ≈ 6 × num_parameters × total_tokens</span>. This
        article is about the other half: what happens to loss once you know that FLOPs number, and
        the Evaluating LLMs article&apos;s cross-entropy loss is the exact y-axis quantity being
        plotted here.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Why this matters practically: a straight line is extrapolatable. Run a handful of small,
        cheap training jobs, say at 10<sup>18</sup> to 10<sup>20</sup> FLOPs, plot the resulting
        losses, fit the line. That line now predicts the loss at 10<sup>24</sup> or 10<sup>25</sup>{" "}
        FLOPs, a run that hasn&apos;t happened yet and would cost millions of dollars if it did.
        This is exactly how frontier labs decide whether a proposed large run is likely to be worth
        its cost, months before committing the hardware, and it&apos;s the empirical foundation
        under everything the rest of this article covers.
      </p>

      <ScalingLawCurve />

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: a straight line on a log-log plot is a power law, not a coincidence of the axes.
          Move the slider above across orders of magnitude of compute and the point never jumps off
          the line, that predictability is the whole reason scaling laws are useful for planning.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        One caveat worth flagging early: this relationship holds for loss, the raw next-token
        prediction quality the model was actually trained to minimize. It does not automatically
        hold for every downstream capability or benchmark score you might care about, and the gap
        between &ldquo;loss went down smoothly&rdquo; and &ldquo;this specific skill improved
        smoothly&rdquo; is exactly the subject of the emergent abilities section later in this
        article.
      </p>
    </section>
  );
}
