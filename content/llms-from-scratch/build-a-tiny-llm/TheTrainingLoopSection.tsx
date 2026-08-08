import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TheTrainingLoopSection() {
  return (
    <section>
      <h2 id="the-training-loop" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The training loop
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A freshly initialized <code>TinyGPT</code> is a random function. Feed it a prompt and it
        produces logits, but the logits are noise, the model has never seen a correct answer.
        It&apos;s tempting to think turning that noise into something coherent takes some separate
        mysterious optimization machinery. It doesn&apos;t. It takes exactly the four steps the Loss
        and Backpropagation article named: forward pass, compute loss, backward pass, optimizer
        step, repeated over batches until the loss stops going down.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        First, batches. Every training step needs input sequences and, for each one, the correct
        next token at every position. Because this is next-token prediction, the target sequence is
        just the input sequence shifted one position to the right, the same objective the very first
        article in this series defined and every article since has assumed.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Sampling a random batch of input/target pairs
        </p>
        <CodeBlock
          code={`def get_batch(data: torch.Tensor, block_size: int, batch_size: int):
    ix = torch.randint(len(data) - block_size - 1, (batch_size,))
    x = torch.stack([data[i : i + block_size] for i in ix])
    y = torch.stack([data[i + 1 : i + block_size + 1] for i in ix])
    return x, y


all_ids = torch.tensor(tokenizer.encode(text), dtype=torch.long)
n = int(0.9 * len(all_ids))
train_data, val_data = all_ids[:n], all_ids[n:]

xb, yb = get_batch(train_data, block_size=128, batch_size=32)
print(xb.shape, yb.shape)`}
          output={`torch.Size([32, 128]) torch.Size([32, 128])`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code>xb</code> and <code>yb</code> are identical in shape and offset by exactly one
        position. Position <em>t</em> of <code>yb</code> is the correct answer for what should come
        after position <em>t</em> of <code>xb</code>. Every position in every sequence in the batch
        produces its own training signal at once, not just the last one, which is why a batch of 32
        sequences of length 128 yields 4,096 individual next-token predictions per step.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Now the loop itself. Forward pass through <code>TinyGPT</code> to get logits, cross-entropy
        between those logits and <code>yb</code>, <code>loss.backward()</code> to run
        backpropagation and populate every parameter&apos;s <code>.grad</code>, and{" "}
        <code>optimizer.step()</code> to nudge every parameter downhill against its gradient. Adam,
        the adaptive variant of gradient descent covered in that article, tracks a running estimate
        of each parameter&apos;s gradient variance and scales its step size accordingly, which is why
        it&apos;s the default choice here rather than plain gradient descent.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Training loop: forward, loss, backward, step
        </p>
        <CodeBlock
          code={`model = TinyGPT(vocab_size=tokenizer.vocab_size)
optimizer = torch.optim.Adam(model.parameters(), lr=3e-4)

block_size = 128
batch_size = 32

for step in range(3000):
    xb, yb = get_batch(train_data, block_size, batch_size)

    logits = model(xb)                              # (B, T, vocab_size)
    B, T, V = logits.shape
    loss = F.cross_entropy(logits.view(B * T, V), yb.view(B * T))

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if step % 500 == 0:
        print(f"step {step:>5} | train loss {loss.item():.4f}")`}
          output={`step     0 | train loss 4.3512
step   500 | train loss 2.4708
step  1000 | train loss 2.1130
step  1500 | train loss 1.8867
step  2000 | train loss 1.7241
step  2500 | train loss 1.6203`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code>logits.view(B * T, V)</code> is the one reshape worth pausing on: cross-entropy in
        PyTorch expects one row of logits per prediction, not per sequence, so the batch and time
        dimensions get flattened together before comparing against the flattened targets. Every one
        of those 4,096 flattened rows contributes its own gradient, and it&apos;s the sum of all of
        them, run backward through every transformer block, every attention projection, every
        feedforward layer, all the way to the embedding table, that <code>loss.backward()</code>
        computes in that single line.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Zoom out and this is the Pretraining at Scale article, at toy scale instead of production
        scale. Same objective, same loop shape, same optimizer. The only differences are the ones
        that article predicted: a corpus measured in hundreds of kilobytes instead of trillions of
        tokens, and a training run measured in a few thousand steps on a laptop instead of hundreds
        of thousands of steps across a cluster of GPUs running for weeks.
      </p>
    </section>
  );
}
