import { NeuronPlayground } from "@/components/blog/interactive/neuron-playground";

export function NeuronPlaygroundSection() {
  return (
    <section>
      <h2 id="neuron-playground" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Watch a neuron compute
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Adjust the three inputs and their weights below and watch the weighted sum, labeled{" "}
        <span className="font-mono">z</span>, update live. Then switch between activation functions
        and watch the same <span className="font-mono">z</span> produce a different final output,
        and notice the shape of each curve: linear never bends, ReLU flattens everything negative to
        exactly zero, sigmoid and tanh both squash extreme values toward a ceiling and floor instead
        of letting them grow without bound.
      </p>

      <NeuronPlayground />

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        That squashing matters beyond this one neuron. Feed a huge positive or negative number
        through sigmoid and the output barely changes no matter how much larger the input gets, the
        curve is nearly flat out there. That flattening is exactly why sigmoid fell out of favor in
        deep networks: a neuron whose output barely moves also barely teaches the network anything
        useful during training, a problem covered directly in the Loss and Backpropagation article.
      </p>
    </section>
  );
}
