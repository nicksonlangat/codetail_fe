import { WhyAttentionCantTellOrderSection } from "./WhyAttentionCantTellOrderSection";
import { SinusoidalEncodingSection } from "./SinusoidalEncodingSection";
import { RotaryPositionEmbeddingsSection } from "./RotaryPositionEmbeddingsSection";
import { PastTrainedContextLengthSection } from "./PastTrainedContextLengthSection";

export const toc = [
  { id: "why-attention-cant-tell-order", title: "Why attention alone can't tell word order" },
  {
    id: "sinusoidal-positional-encoding",
    title: "Sinusoidal positional encoding: a unique fingerprint per position",
  },
  {
    id: "rotary-position-embeddings",
    title: "Rotary position embeddings (RoPE): encoding position as rotation",
  },
  { id: "past-trained-context-length", title: "What happens past the trained context length" },
];

export default function PositionalEncodingArticle() {
  return (
    <>
      <WhyAttentionCantTellOrderSection />
      <SinusoidalEncodingSection />
      <RotaryPositionEmbeddingsSection />
      <PastTrainedContextLengthSection />
    </>
  );
}
