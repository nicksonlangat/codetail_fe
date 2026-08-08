import { CodeBlock } from "@/components/blog/interactive/code-block";

export function BatchesTokensAndStepsSection() {
  return (
    <section>
      <h2
        id="batches-tokens-and-steps"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Batches, tokens, and steps: the units a training run is measured in
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The Loss and Backpropagation article walked through one training step: feed a batch of
        examples through the model, compute the loss, run backpropagation, update the weights. That
        description is correct and it&apos;s also, at the scale of a real pretraining run, a single
        tick of a clock that runs for weeks. The question this section answers is what that tick
        actually contains, and how many times it ticks.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A <strong>batch</strong> is a fixed number of token sequences processed together in one
        forward and backward pass, exactly the &ldquo;batch of examples&rdquo; from that earlier
        article, just at production scale. Each sequence has a fixed <strong>sequence length</strong>,
        the number of tokens the model looks at in one shot, commonly somewhere between 2,048 and
        32,000 for current models. The <strong>batch size</strong> is how many of those sequences get
        processed in parallel before a single weight update happens. Multiply the two together and
        you get the number of tokens one step actually touches.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Tokens processed per step, and across a full run
        </p>
        <CodeBlock
          code={`batch_size = 1024        # sequences processed per step
seq_length = 4096        # tokens per sequence
num_steps = 500_000       # total weight updates over the whole run

tokens_per_step = batch_size * seq_length
total_tokens = tokens_per_step * num_steps

print(tokens_per_step)   # 4,194,304 tokens in this one step
print(total_tokens)      # 2,097,152,000,000 tokens over the full run`}
          output={`4194304
2097152000000`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Read that last number out loud: roughly two trillion tokens, seen once each, across the
        whole run. That&apos;s the arithmetic behind every &ldquo;trained on N trillion tokens&rdquo;
        claim you&apos;ll see in a model card: it&apos;s just batch size times sequence length times
        number of steps, nothing more exotic than that. Push any one of those three numbers up and
        the total goes up too, which is exactly why they&apos;re the numbers labs report when they
        talk about a run.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: bigger batch size means a more accurate gradient estimate per step (you&apos;re
          averaging the loss over more examples) but each step costs proportionally more compute.
          Labs pick batch size based on how much they can fit across their GPUs at once, not as a
          free knob, doubling it doesn&apos;t make training free, it just changes how the same total
          compute gets divided into steps.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        One more distinction worth being precise about: &ldquo;seeing a token&rdquo; doesn&apos;t
        mean the model memorizes it. It means that token contributed one next-token-prediction
        example to one gradient update, alongside millions of others in the same step. Most tokens
        in a trillion-token run are seen exactly once, maybe twice if the dataset gets a second
        pass. There usually isn&apos;t time or need for more than that, which is part of why the raw
        size and quality of the dataset matters so much, covered later in this article.
      </p>
    </section>
  );
}
