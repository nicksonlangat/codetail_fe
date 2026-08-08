import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TemperatureSection() {
  return (
    <section>
      <h2
        id="temperature"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Temperature: turning the randomness dial
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        &ldquo;Temperature&rdquo; sounds like a mood setting, calm versus wild. It&apos;s actually
        one line of arithmetic applied before softmax runs: divide every logit by a number{" "}
        <em>T</em>, then softmax the result as usual.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Temperature-scaled softmax
        </p>
        <CodeBlock
          code={`import math

def softmax_with_temperature(logits, temperature):
    scaled = [logit / temperature for logit in logits]
    m = max(scaled)
    exps = [math.exp(x - m) for x in scaled]
    total = sum(exps)
    return [e / total for e in exps]`}
          output={``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        You saw the temperature slider reshape this same kind of distribution back in the first
        article of this series, the exponential in softmax is what makes dividing the logits do
        something non-obvious to the output shape. Here&apos;s the mechanism in full. Dividing by{" "}
        <em>T</em> less than 1 makes the logits bigger in magnitude before the exponential runs,
        which stretches the gap between the top candidate and everything else. The distribution
        sharpens: probability mass concentrates on the tokens that were already ahead. Push{" "}
        <em>T</em> toward 0 and it approaches picking the single highest-probability token every
        time, deterministic, and at the extreme, repetitive, the model loops on its own safest
        continuation.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Dividing by <em>T</em> greater than 1 does the opposite: it shrinks the logits toward each
        other before the exponential runs, so the gap between the best token and the rest narrows.
        The distribution flattens, tokens that were barely plausible get a real shot at being
        sampled. Push <em>T</em> high enough and the model is close to picking uniformly at
        random from the vocabulary, more variety, and at the extreme, word salad. Neither end of
        the dial is usually where you want to sit. Most chat models default somewhere around 0.7
        to 1.0.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Gotcha: T equal to 0 divides by zero. Every serious implementation special-cases T=0 to
          mean greedy decoding, argmax straight from the logits, rather than actually running the
          division. If you ever see temperature 0 described as &ldquo;a very sharp distribution,&rdquo;
          that&apos;s the rounded-off truth. It&apos;s not sampling at all.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Temperature alone reshapes the whole distribution, but it never removes a token from
        consideration entirely, only softmax-adjacent math ever assigns something exactly zero
        probability. That turns out to be a problem, because the vocabulary is huge and the tail
        of barely-plausible tokens is long. Reshaping isn&apos;t the same as cutting it off.
      </p>
    </section>
  );
}
