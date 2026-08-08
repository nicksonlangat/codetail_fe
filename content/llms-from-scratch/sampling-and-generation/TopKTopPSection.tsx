import { SamplingPlayground } from "@/components/blog/interactive/sampling-playground";

export function TopKTopPSection() {
  return (
    <section>
      <h2
        id="top-k-and-top-p"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Top-k and top-p (nucleus) sampling: cutting off the long tail
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        You&apos;d think a well-tuned temperature is enough. It isn&apos;t, and the reason is
        scale. A real vocabulary has tens of thousands of entries, and even a confident,
        well-trained distribution assigns some sliver of probability to thousands of tokens that
        are, in context, nonsense. Individually those slivers are tiny. Collectively, across a
        long generation, sampling from that whole tail eventually pulls one of them. Generation is
        autoregressive, every later token is conditioned on everything emitted so far, so one
        garbage token early in a sentence doesn&apos;t just look bad, it drags the rest of the
        sentence down with it. Temperature reshapes the distribution. It never removes anything
        from it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <strong>Top-k</strong> is the blunt fix: keep only the <em>k</em> highest-probability
        tokens, discard the rest outright, renormalize what&apos;s left so it sums back to 1. If{" "}
        <em>k</em> is 5, only 5 tokens are ever eligible, no matter how the rest of the probability
        mass is distributed among the thousands you cut. Simple, cheap, and its exact weakness is
        that fixed number. A model that&apos;s extremely confident, 90% of its mass on one token,
        still gets 4 other tokens forced into contention. A model that&apos;s genuinely torn
        between a dozen reasonable continuations gets artificially capped at 5, and some of those
        reasonable options never get a chance.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <strong>Top-p</strong>, also called <strong>nucleus sampling</strong>, fixes exactly that.
        Instead of a fixed count, sort tokens by probability descending and keep adding them to the
        eligible set until their cumulative probability crosses a threshold, commonly 0.9. That set
        might be 2 tokens wide or 40, it adapts to the shape of the distribution at that specific
        step. A peaked, confident distribution needs only a couple of tokens to reach 0.9 of the
        mass. A flat, genuinely uncertain distribution needs many more, and top-p keeps all of them
        eligible instead of arbitrarily lopping off at some fixed rank.
      </p>

      <SamplingPlayground />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Switch between the two presets above and watch the survivor count. On the peaked
        &ldquo;capital of France&rdquo; distribution, top-p at 0.9 keeps around 4 tokens,
        everything past &ldquo;located&rdquo; is already redundant. Fix top-k at 5 instead on that
        same distribution and a token like &ldquo;actually&rdquo; sneaks in purely because 5 was
        the number you picked, not because the model thought it was plausible. Now switch to the
        flatter &ldquo;favorite hobby&rdquo; distribution: top-p at 0.9 has to keep 8 tokens to
        reach the threshold, but a fixed top-k of 5 would cut &ldquo;gardening,&rdquo;
        &ldquo;writing,&rdquo; and &ldquo;cycling,&rdquo; three answers that were nearly as likely
        as the ones kept. Same k, opposite outcome, because k doesn&apos;t know or care how
        confident the model is at that step.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: top-k enforces a fixed shape on the eligible set, top-p enforces a fixed amount of
          probability mass. That&apos;s why top-p adapts per step and top-k doesn&apos;t. In
          practice: most production systems apply both together with temperature, top-k as a coarse
          safety cap and top-p as the adaptive cutoff on top of it, exactly the combination in the
          widget above.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Temperature decides how sharp or flat the distribution is. Top-k and top-p decide how much
        of that distribution&apos;s tail is even in play before sampling happens. All three still
        leave one thing unanswered: why sample at all, instead of always taking the safest,
        highest-probability path.
      </p>
    </section>
  );
}
