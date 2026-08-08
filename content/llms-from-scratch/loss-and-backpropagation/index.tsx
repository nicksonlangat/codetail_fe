import { CrossEntropyLossSection } from "./CrossEntropyLossSection";
import { GradientDescentSection } from "./GradientDescentSection";
import { BackpropagationSection } from "./BackpropagationSection";
import { TrainingStepSection } from "./TrainingStepSection";

export const toc = [
  { id: "cross-entropy-loss", title: 'Cross-entropy loss: turning "wrong" into one number' },
  { id: "gradient-descent", title: "Gradient descent: which direction reduces the loss" },
  { id: "backpropagation", title: "Backpropagation: the chain rule, computed automatically" },
  { id: "training-step", title: "What one training step actually changes" },
];

export default function LossAndBackpropagationArticle() {
  return (
    <>
      <CrossEntropyLossSection />
      <GradientDescentSection />
      <BackpropagationSection />
      <TrainingStepSection />
    </>
  );
}
