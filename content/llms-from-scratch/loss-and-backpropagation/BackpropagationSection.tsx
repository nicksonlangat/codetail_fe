import { CodeBlock } from "@/components/blog/interactive/code-block";

export function BackpropagationSection() {
  return (
    <section>
      <h2
        id="backpropagation"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Backpropagation: the chain rule, computed automatically
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        So the gradient tells you which way to step. But how do you actually compute it for a
        weight sitting in an early transformer block, buried under dozens of stacked blocks like
        the ones from the transformer block article, when all you can directly measure is the loss
        at the very end. The naive approach: nudge that one weight slightly, rerun the entire
        forward pass, see how much the loss moved, divide. That gives you the gradient for exactly
        one weight, at the cost of a full forward pass. Repeat that for every weight in a
        billion-parameter model and you&apos;d need a billion forward passes just to take a single
        training step. That&apos;s not slow, it&apos;s not happening.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <strong>Backpropagation</strong> gets every weight&apos;s gradient in roughly the cost of
        one extra pass through the network, and the trick is a calculus rule you likely met before
        you ever touched machine learning: the <strong>chain rule</strong>. The loss depends on the
        final layer&apos;s output, which depends on the second-to-last layer&apos;s output, which
        depends on the layer before that, all the way back to the first embedding. The chain rule
        says the effect of an early layer on the final loss is just the product of each layer&apos;s
        local effect on the next one, multiplied together, link by link.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Think of it as an assembly line where something comes out defective at the end. You don&apos;t
        re-inspect every station from scratch to find the cause. You start at the last station and
        ask &ldquo;how much did you change what came in,&rdquo; then move one station back and ask
        the same question, reusing what you already worked out downstream instead of recomputing
        it. Backpropagation runs exactly this pass, once, backward through the whole network:
        start at the loss, compute how much the last layer&apos;s output affects it, then move one
        layer back and combine that with how much this layer affects the next one, then the next
        layer back, reusing every intermediate result instead of starting over.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Chain rule through a tiny two-layer toy network
        </p>
        <CodeBlock
          code={`# y1 = layer1(x, w1)
# y2 = layer2(y1, w2)
# loss = cross_entropy(y2, target)

# forward pass, left to right, values get cached
y1 = layer1(x, w1)
y2 = layer2(y1, w2)
loss = cross_entropy(y2, target)

# backward pass, right to left, reusing cached values
d_loss_d_y2 = cross_entropy_grad(y2, target)
d_loss_d_w2 = d_loss_d_y2 * layer2_grad_w(y1, w2)
d_loss_d_y1 = d_loss_d_y2 * layer2_grad_x(y1, w2)
d_loss_d_w1 = d_loss_d_y1 * layer1_grad_w(x, w1)
# d_loss_d_y1 already folds in everything downstream,
# layer 1's gradient never has to look past layer 2`}
          output={``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Notice <span className="font-mono">d_loss_d_y1</span> in that last block. It&apos;s
        computed once and it already accounts for everything that happens after layer 1, the whole
        rest of the network, folded into a single number through the chain rule multiplication.
        Layer 1&apos;s own gradient just multiplies that one number by its own local derivative. It
        never needs to know layer 2 exists in any more detail than that. Stack forty transformer
        blocks instead of two and the pattern is identical, just a longer chain, each link
        computed once and handed backward.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This reuse is also why backpropagation needs memory, not just compute. Every intermediate
        value computed during the forward pass has to stay cached until the backward pass reaches
        it, because the chain rule needs those exact numbers to multiply against. That cache is a
        big share of why training a model takes so much more memory than just running it
        afterward.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This is the piece that makes training billions of parameters tractable at all. Not one
        gradient computation per weight, one backward pass, shared across every weight in the
        model, each one picking up exactly the piece of the chain rule product that belongs to it.
      </p>
    </section>
  );
}
