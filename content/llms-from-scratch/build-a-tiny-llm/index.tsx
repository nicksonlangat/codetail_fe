import { ThePlanSection } from "./ThePlanSection";
import { TokenizerAndEmbeddingsSection } from "./TokenizerAndEmbeddingsSection";
import { TheTransformerBlockStackSection } from "./TheTransformerBlockStackSection";
import { TheTrainingLoopSection } from "./TheTrainingLoopSection";
import { GenerationSamplingSection } from "./GenerationSamplingSection";

export const toc = [
  { id: "the-plan", title: "The plan: every piece, in one file" },
  { id: "tokenizer-and-embeddings", title: "Tokenizer and embeddings, wired together" },
  { id: "the-transformer-block-stack", title: "The transformer block stack" },
  { id: "the-training-loop", title: "The training loop" },
  { id: "generation-sampling-text", title: "Generation: sampling text from the trained model" },
];

export default function BuildATinyLlmArticle() {
  return (
    <>
      <ThePlanSection />
      <TokenizerAndEmbeddingsSection />
      <TheTransformerBlockStackSection />
      <TheTrainingLoopSection />
      <GenerationSamplingSection />
    </>
  );
}
