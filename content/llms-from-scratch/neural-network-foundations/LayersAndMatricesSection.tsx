import { CodeBlock } from "@/components/blog/interactive/code-block";

export function LayersAndMatricesSection() {
  return (
    <section>
      <h2 id="layers-and-matrices" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        From one neuron to a layer, from a layer to a matrix
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A real network doesn&apos;t use one neuron, it uses many neurons side by side, each looking
        at the exact same inputs, each with its own independent set of weights. That group is called
        a <strong>layer</strong>. One neuron might learn to respond to something like negation, a
        different one in the same layer to something like tense, a third to something with no
        clean human name at all, purely because it helped the training objective.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Computing every neuron in a layer one at a time, in a loop, is exactly what a{" "}
        <strong>matrix multiplication</strong> does in a single operation. Stack every neuron&apos;s
        weights as a row of a matrix, multiply that matrix by the input vector, and the result is
        every neuron&apos;s weighted sum, all at once. This is not an approximation of what a layer
        does, it is a literal restatement of the same arithmetic in a form GPUs can execute
        extremely fast, thousands of neurons at a time.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A layer of 2 neurons, as a loop and as a matrix multiply
        </p>
        <CodeBlock
          code={`inputs = [1.0, 0.5, -1.0]

# As a loop, one neuron at a time
neuron_1_weights = [0.6, -0.8, 0.3]
neuron_2_weights = [0.1, 0.4, -0.2]
out_1 = sum(i * w for i, w in zip(inputs, neuron_1_weights))
out_2 = sum(i * w for i, w in zip(inputs, neuron_2_weights))

# As one matrix multiply, identical result
import numpy as np
weight_matrix = np.array([neuron_1_weights, neuron_2_weights])
outputs = weight_matrix @ np.array(inputs)`}
          output={`out_1, out_2 = -0.1, 0.5
outputs = array([-0.1,  0.5])`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Stack several of these layers, each one's output feeding the next layer's input, activation
        functions between them, and that's a <strong>multilayer perceptron</strong>, the feedforward
        network embedded inside every transformer block. It is also, structurally, the entire
        machinery: everything from here through the end of this series, attention, transformer
        blocks, the whole model, is built from exactly these two operations, matrix multiplication
        and activation functions, arranged in different configurations.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted italic">
          In practice: when a paper says a model has &ldquo;7 billion parameters,&rdquo; it means
          the combined weight matrices and biases across every layer contain 7 billion individual
          numbers, each one adjusted during training, each one contributing to weighted sums exactly
          like the ones above.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6">
        What's still missing is how a network decides which earlier words in a sentence actually
        matter to the word it's currently processing. A plain feedforward layer treats every input
        position the same way every time, it has no mechanism for looking back at a sentence and
        deciding "that pronoun refers to this noun." That mechanism, built from the same
        matrix multiplication covered here plus the cosine-similarity-style comparison from the
        embeddings article, is attention, covered next.
      </p>
    </section>
  );
}
