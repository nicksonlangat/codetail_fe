import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhatANeuronComputesSection() {
  return (
    <section>
      <h2 id="what-a-neuron-computes" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        What a neuron actually computes
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Skip past the biology metaphor. A neuron in a neural network is not a simulated brain cell,
        it is two arithmetic operations, applied one after the other. First, a weighted sum: take
        every input number, multiply each by its own weight, add them all up, then add one more
        number called the bias. Second, pass that sum through a small, fixed function called an{" "}
        <strong>activation function</strong>. That&apos;s the entire computation. Nothing hidden,
        nothing mystical.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          One neuron, three inputs
        </p>
        <CodeBlock
          code={`inputs = [1.0, 0.5, -1.0]
weights = [0.6, -0.8, 0.3]
bias = 0.0

weighted_sum = sum(i * w for i, w in zip(inputs, weights)) + bias
# (1.0 * 0.6) + (0.5 * -0.8) + (-1.0 * 0.3) + 0.0 = 0.6 - 0.4 - 0.3 = -0.1

output = max(0, weighted_sum)  # ReLU activation
# max(0, -0.1) = 0`}
          output={`weighted_sum = -0.1
output = 0`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The weights and the bias are the only numbers this neuron actually owns, and they are
        exactly what training adjusts. Everything a network &ldquo;learns&rdquo; is a change to
        these weight values, nothing else. A trained model with billions of parameters is, at the
        arithmetic level, billions of numbers exactly like the <span className="font-mono">0.6</span>,{" "}
        <span className="font-mono">-0.8</span>, and <span className="font-mono">0.3</span> above.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: a neuron is weighted-sum-then-activation. Nothing about the word
          &ldquo;neural&rdquo; implies anything more sophisticated is happening underneath a single
          unit. Sophistication comes from how many of these are wired together, not from any one
          of them individually.
        </p>
      </div>
    </section>
  );
}
