import { WhatANeuronComputesSection } from "./WhatANeuronComputesSection";
import { WhyNonlinearitySection } from "./WhyNonlinearitySection";
import { NeuronPlaygroundSection } from "./NeuronPlaygroundSection";
import { LayersAndMatricesSection } from "./LayersAndMatricesSection";

export const toc = [
  { id: "what-a-neuron-computes", title: "What a neuron actually computes" },
  { id: "why-nonlinearity", title: "Why the activation function isn't optional" },
  { id: "neuron-playground", title: "Watch a neuron compute" },
  { id: "layers-and-matrices", title: "From one neuron to a layer, to a matrix" },
];

export default function NeuralNetworkFoundationsArticle() {
  return (
    <>
      <WhatANeuronComputesSection />
      <WhyNonlinearitySection />
      <NeuronPlaygroundSection />
      <LayersAndMatricesSection />
    </>
  );
}
