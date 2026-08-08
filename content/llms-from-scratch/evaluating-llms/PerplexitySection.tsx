import { CodeBlock } from "@/components/blog/interactive/code-block";
import { PerplexityCalculator } from "@/components/blog/interactive/perplexity-calculator";

export function PerplexitySection() {
  return (
    <section>
      <h2 id="perplexity" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Perplexity: cross-entropy loss, made interpretable
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s tempting to treat perplexity as some separate evaluation metric, invented
        specifically to score language models after the fact. It isn&apos;t. The Loss and
        Backpropagation article covered cross-entropy loss as the number a model is trained to
        minimize: the negative log probability it assigned to the actual next token, averaged
        across every token it sees. Perplexity is that exact same number, unchanged, run through
        one transformation. Exponentiate it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <span className="font-mono">perplexity = e ^ (average cross-entropy loss)</span>. That is
        the whole formula. Nothing new gets measured, nothing new gets computed during evaluation
        that wasn&apos;t already being computed during training. The only reason this
        transformation exists is that a raw loss value like 2.0 doesn&apos;t mean anything to a
        human on its own. Perplexity turns it into a count you can actually picture.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Take a model with an average cross-entropy loss of 2.0 nats on some test set. e^2 is about
        7.4. That means, on average, across this test set, the model was about as unsure at each
        step as if it had to choose uniformly among roughly 7 equally likely next tokens, then
        happened to guess right. Push the loss down to 0.5 and perplexity drops to about 1.6, close
        to certain. Push it up to 5.0 and perplexity jumps to about 148, badly lost. Same
        underlying number every time, one version a person can reason about at a glance.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Perplexity from the per-token losses already computed during training
        </p>
        <CodeBlock
          code={`import math

def perplexity(losses):
    # losses: per-token cross-entropy loss on a held-out
    # test set, the same quantity minimized during training
    avg_loss = sum(losses) / len(losses)
    return math.exp(avg_loss)

perplexity([1.8, 2.1, 1.9, 2.2, 2.0])  # average loss 2.0`}
          output={`7.389056...`}
        />
      </div>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: perplexity and cross-entropy loss move together by definition, not by empirical
          correlation. A model with lower loss has lower perplexity, always. There is no scenario
          where one drops and the other doesn&apos;t follow.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Try it directly below. Five toy predictions, one slider per token, each one the
        model&apos;s actual assigned probability for the real next word in &ldquo;The cat sat on
        the mat.&rdquo; Pull a slider down toward an unconfident guess and watch both numbers move
        together, the per-token loss climbs and the perplexity across all five climbs right along
        with it.
      </p>

      <PerplexityCalculator />

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Real perplexity numbers get computed over a held-out test set of thousands or millions of
        tokens, not five, and they are only ever meaningfully compared between models scored on the
        exact same test set with the exact same tokenizer. A perplexity of 12 on one dataset and 15
        on a different one says nothing about which model is better. The comparison only holds once
        the test set is held fixed.
      </p>
    </section>
  );
}
