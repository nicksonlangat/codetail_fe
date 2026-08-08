import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TrainingStepSection() {
  return (
    <section>
      <h2
        id="training-step"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        What one training step actually changes
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Put the three previous sections in order and a single training step is just four moves,
        repeated: run the forward pass and get a probability distribution, score it against the
        correct token with cross-entropy loss, run backpropagation to get a gradient for every
        single parameter in the model, then nudge every weight a small amount opposite its
        gradient. Then do it again, on the next batch of text.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          One training step, top to bottom
        </p>
        <CodeBlock
          code={`def training_step(model, batch, optimizer):
    logits = model.forward(batch.tokens)          # forward pass
    loss = cross_entropy(logits, batch.targets)     # one scalar
    gradients = backprop(loss, model.parameters)    # one gradient per weight
    optimizer.step(model.parameters, gradients)     # nudge every weight
    return loss`}
          output={``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That <span className="font-mono">optimizer.step</span> line is doing plain gradient
        descent under the hood in the simplest case, subtract learning rate times gradient, but
        almost no real model trains on plain gradient descent anymore. The near-universal default
        is <strong>Adam</strong>, which keeps a running memory of each parameter&apos;s recent
        gradients and adjusts its effective step size per parameter instead of using one fixed
        learning rate for every weight in the model. The mechanism this article covers, forward,
        loss, backward, step, doesn&apos;t change. Adam just makes each step smarter about its own
        size, and that&apos;s as deep as this series needs to go on it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Here&apos;s the part that surprises people the first time they actually watch it happen:
        one step barely moves anything. A single weight might shift by a few thousandths, an
        amount that changes the model&apos;s output on that specific example by a hair and does
        essentially nothing measurable to its behavior on anything else. No single step teaches
        the model to write code or hold a conversation. It just makes tomorrow&apos;s wrong answer
        on that one example fractionally less wrong.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        That&apos;s exactly why this loop needs to run so many times. Not because any individual
        step is doing something dramatic, but because a model trains on hundreds of billions of
        tokens, one tiny nudge per batch, compounding across hundreds of thousands of steps. There
        is no shortcut version of this and no hidden insight step that does more than the others.
        It&apos;s the same four moves this article walked through, over and over, at a scale that
        the next article, Pretraining at Scale, covers directly.
      </p>
    </section>
  );
}
