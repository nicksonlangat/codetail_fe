import { ChunkingSection } from "./ChunkingSection";
import { EmbeddingModelChoiceSection } from "./EmbeddingModelChoiceSection";
import { ANNIndexSection } from "./ANNIndexSection";
import { WhenSimilarityLiesSection } from "./WhenSimilarityLiesSection";

export const toc = [
  { id: "chunking-strategy", title: "How you split a document decides what retrieval can ever find" },
  { id: "choosing-an-embedding-model", title: "Switching embedding models later means re-embedding everything" },
  { id: "approximate-nearest-neighbor-search", title: "Comparing against every vector doesn't scale, so nobody actually does it" },
  { id: "when-similarity-search-misleads", title: "Similar in meaning isn't the same as useful for answering the question" },
];

export default function EmbeddingsAndVectorSearchInPracticeArticle() {
  return (
    <>
      <ChunkingSection />
      <EmbeddingModelChoiceSection />
      <ANNIndexSection />
      <WhenSimilarityLiesSection />
    </>
  );
}
