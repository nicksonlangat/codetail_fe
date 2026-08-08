import { IdToVectorSection } from "./IdToVectorSection";
import { GeometryOfMeaningSection } from "./GeometryOfMeaningSection";
import { MeasuringSimilaritySection } from "./MeasuringSimilaritySection";
import { WhyEmbeddingsMatterSection } from "./WhyEmbeddingsMatterSection";

export const toc = [
  { id: "id-to-vector", title: "A token ID is not a meaningful number" },
  { id: "geometry-of-meaning", title: "Distance and direction become meaning" },
  { id: "measuring-similarity", title: "How \"close\" gets measured" },
  { id: "why-embeddings-matter", title: "Learned, not designed" },
];

export default function EmbeddingsArticle() {
  return (
    <>
      <IdToVectorSection />
      <GeometryOfMeaningSection />
      <MeasuringSimilaritySection />
      <WhyEmbeddingsMatterSection />
    </>
  );
}
