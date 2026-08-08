import { ArchitectureDiagramSection } from "./ArchitectureDiagramSection";
import { MultiHeadAttentionSection } from "./MultiHeadAttentionSection";
import { FeedforwardSublayerSection } from "./FeedforwardSublayerSection";
import { ResidualsAndLayerNormSection } from "./ResidualsAndLayerNormSection";

export const toc = [
  { id: "architecture-diagram-piece-by-piece", title: "The architecture diagram, piece by piece" },
  { id: "multi-head-attention", title: "Multi-head attention: running several attentions in parallel" },
  { id: "feedforward-sublayer", title: 'The feedforward sublayer: where the model actually "thinks"' },
  { id: "residual-connections-and-layer-norm", title: "Residual connections and layer norm: why deep stacks don't collapse" },
];

export default function TheTransformerBlockArticle() {
  return (
    <>
      <ArchitectureDiagramSection />
      <MultiHeadAttentionSection />
      <FeedforwardSublayerSection />
      <ResidualsAndLayerNormSection />
    </>
  );
}
