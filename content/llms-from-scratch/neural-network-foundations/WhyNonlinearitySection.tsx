import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhyNonlinearitySection() {
  return (
    <section>
      <h2 id="why-nonlinearity" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Why the activation function isn&apos;t optional
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It's reasonable to wonder why the weighted sum alone isn't enough, why bother squashing it
        through another function afterward. Here's the problem stacking creates if you skip that
        step: stacking two purely linear layers, weighted sum feeding directly into another weighted
        sum with no activation in between, produces something that is mathematically still just one
        linear layer. No amount of stacking helps.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Two linear layers collapse into one
        </p>
        <CodeBlock
          code={`def layer(x, w, b):
    return w * x + b

x = 4
layer1 = layer(x, w=2, b=3)       # 2*4 + 3 = 11
layer2 = layer(layer1, w=-1, b=5) # -1*11 + 5 = -6

# Same result from a single combined layer:
combined_w = 2 * -1   # -2
combined_b = -1 * 3 + 5  # 2
single_layer = combined_w * x + combined_b  # -2*4 + 2 = -6`}
          output={`layer2 = -6
single_layer = -6  (identical)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Two layers, four numbers, and it still only computes a straight line. Stack a hundred linear
        layers and you still only get a straight line, just with different slope and offset. A
        straight line cannot represent most of what language requires: whether a sentence is
        sarcastic, whether a pronoun refers back three sentences or one, whether a number is odd.
        Those relationships are not straight lines through the data.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The activation function is what breaks the collapse. Because it bends the output, ReLU
        clips every negative value to zero, sigmoid squashes everything into a 0 to 1 curve, stacking
        layers with an activation in between actually builds something new at each layer, not a
        repackaged version of the first one. This is the entire reason depth in a
        &ldquo;deep&rdquo; neural network does anything at all.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> modern transformers mostly use GELU or SwiGLU rather than
          plain ReLU or sigmoid, smoother variants that tend to train better at scale. The specific
          curve differs, but the reason one exists at all is exactly the collapse argument above.
        </p>
      </div>
    </section>
  );
}
