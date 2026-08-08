import { ScalingLawShapeSection } from "./ScalingLawShapeSection";
import { ChinchillaComputeOptimalSection } from "./ChinchillaComputeOptimalSection";
import { EmergentAbilitiesSection } from "./EmergentAbilitiesSection";
import { PredictingBeforeTrainingSection } from "./PredictingBeforeTrainingSection";

export const toc = [
  { id: "scaling-law-shape", title: "The scaling law shape: loss falls predictably with compute" },
  { id: "chinchilla-compute-optimal", title: "Chinchilla: parameters versus data, the compute-optimal tradeoff" },
  { id: "emergent-abilities", title: 'What "emergent" abilities are, and reason for skepticism about the term' },
  { id: "predicting-before-training", title: "Using scaling laws to predict a model before training it" },
];

export default function ScalingLawsArticle() {
  return (
    <>
      <ScalingLawShapeSection />
      <ChinchillaComputeOptimalSection />
      <EmergentAbilitiesSection />
      <PredictingBeforeTrainingSection />
    </>
  );
}
