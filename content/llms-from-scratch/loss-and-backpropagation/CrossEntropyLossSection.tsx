import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CrossEntropyLossSection() {
  return (
    <section>
      <h2
        id="cross-entropy-loss"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Cross-entropy loss: turning &ldquo;wrong&rdquo; into one number
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s tempting to picture training as grading a quiz. The model guesses a word, you
        mark it right or wrong, tally the score. That picture is wrong in a way that matters. The
        forward pass covered in the first seven articles of this series never outputs a single
        guess. It outputs a full probability distribution over the entire vocabulary, one number
        per possible next token, all summing to 1, the same softmax output from the very first
        article. Training needs to turn that whole distribution, compared against the one token
        that was actually correct, into a single scalar it can push down. That scalar is the{" "}
        <strong>loss</strong>.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The function that does this is <strong>cross-entropy loss</strong>, and the formula is
        smaller than people expect. Find the probability the model assigned to the correct token,
        call it <span className="font-mono">p</span>, and compute:
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Cross-entropy loss for one token prediction
        </p>
        <CodeBlock
          code={`import math

def cross_entropy(probabilities, correct_index):
    p = probabilities[correct_index]
    return -math.log(p)

# model is confident and right
cross_entropy(probabilities=[0.01, 0.02, 0.90, 0.07], correct_index=2)
# model is confident and wrong
cross_entropy(probabilities=[0.01, 0.02, 0.02, 0.95], correct_index=2)`}
          output={`0.105
3.912`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That is the entire computation. No averaging over classes, no comparison against every
        wrong answer individually, just the negative log of the probability assigned to the one
        token that actually came next. Everything else the model output that step, the other tens
        of thousands of vocabulary entries, gets ignored by the loss entirely. It only cares how
        much probability mass landed on the right answer.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Think about a weather forecaster instead of a quiz. One forecaster says 90% chance of rain,
        it doesn&apos;t rain. Embarrassing, but not a disaster, they hedged. A second forecaster
        says 99.99% chance of no rain, and it pours. That forecaster deserves to be punished far
        harder, not a little harder, because they staked almost all their credibility on being
        wrong. <span className="font-mono">-log(p)</span> is exactly this scoring rule. When{" "}
        <span className="font-mono">p</span> is near 1, the correct answer, <span className="font-mono">-log(p)</span> is
        near 0, barely a penalty. As <span className="font-mono">p</span> creeps toward 0, the
        penalty doesn&apos;t rise gently, it explodes toward infinity. Confidently wrong costs
        dramatically more than mildly wrong, and that asymmetry is exactly the behavior you want
        out of a training signal.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: cross-entropy loss punishes confident wrongness far more than it rewards confident
          correctness. A model that hedges its bets when uncertain will always outscore one that
          guesses with false conviction, which is exactly the incentive you want baked into the
          objective before training even starts.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        In practice a training batch has thousands of these per-token losses, one for every
        position in every sequence, and they get averaged into one number for the whole batch. That
        single average is the number the rest of this article exists to shrink. Everything from
        here on is about answering one question: given that this number is higher than we&apos;d
        like, which direction do we nudge every weight in the model to bring it down.
      </p>
    </section>
  );
}
