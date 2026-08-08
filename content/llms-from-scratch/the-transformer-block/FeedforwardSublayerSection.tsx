import { CodeBlock } from "@/components/blog/interactive/code-block";

export function FeedforwardSublayerSection() {
  return (
    <section>
      <h2
        id="feedforward-sublayer"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        The feedforward sublayer: where the model actually &ldquo;thinks&rdquo;
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s tempting to assume attention is where the real thinking happens, it&apos;s the
        piece with the evocative name and the worked example you can trace by hand. But attention
        only moves information between positions. Underneath the softmax weighting, it&apos;s a
        weighted average of value vectors, a linear combination. Recall from the neural network
        foundations article: stacking linear operations with nothing nonlinear between them
        collapses into a single linear operation, no matter how many attention heads you run in
        parallel. Attention alone can gather, it can&apos;t transform.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The <strong>feedforward sublayer</strong> is where that transformation happens. It&apos;s
        two linear layers with a nonlinear activation between them, usually ReLU in older models
        or GELU in most modern ones, the same activation functions from the neuron playground in
        an earlier article. The first layer expands each token&apos;s vector up, typically to about
        4 times the model&apos;s dimension, the second layer projects it back down to the original
        size. A 512-dimensional model routes each token through a 2,048-dimensional hidden layer
        and back.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Think of attention as a meeting: every token gathers notes from everyone else in the room.
        The feedforward layer is each token going back to its own desk afterward and doing
        something with what it heard, alone. Every desk runs the identical process, the same two
        weight matrices, applied independently and in parallel to every position. That&apos;s the
        &ldquo;position-wise&rdquo; part of the name you&apos;ll see in papers: no token&apos;s
        feedforward computation ever looks at another token&apos;s vector, all the cross-token
        mixing already happened one step earlier, in attention.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The same two-layer network applied to every position, independently
        </p>
        <CodeBlock
          code={`def feedforward(x, d_model, d_ff):
    # x: one token's vector, shape (d_model,). d_ff is usually 4 * d_model.
    hidden = relu(x @ W1 + b1)   # up-project: (d_model,) -> (d_ff,)
    return hidden @ W2 + b2      # down-project: (d_ff,) -> (d_model,)`}
          output={``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        In most transformers, this sublayer holds the majority of the model&apos;s parameters, two
        matrices of roughly <em>d_model</em> by <em>4 &times; d_model</em> each, comfortably
        outweighing the attention weights sitting right next to them in the same block. Scaling a
        model up, a later article in this series covers this directly, is largely a story about
        scaling this piece.
      </p>
    </section>
  );
}
