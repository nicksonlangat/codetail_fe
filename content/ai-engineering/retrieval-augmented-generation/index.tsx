import { TheFullPipelineSection } from "./TheFullPipelineSection";
import { WhereRetrievalBreaksSection } from "./WhereRetrievalBreaksSection";
import { RerankingSection } from "./RerankingSection";
import { WhenRAGIsntTheAnswerSection } from "./WhenRAGIsntTheAnswerSection";

export const toc = [
  { id: "the-full-pipeline", title: "Six steps, usually drawn as one box labeled RAG" },
  { id: "where-retrieval-quietly-breaks", title: "RAG doesn't remove hallucination, it moves what gets hallucinated about" },
  { id: "reranking-the-cheap-way-and-the-real-way", title: "Retrieve wide and cheap, then rerank narrow and precise" },
  { id: "when-rag-isnt-the-answer", title: "RAG is for facts that live in a specific, changing corpus" },
];

export default function RetrievalAugmentedGenerationArticle() {
  return (
    <>
      <TheFullPipelineSection />
      <WhereRetrievalBreaksSection />
      <RerankingSection />
      <WhenRAGIsntTheAnswerSection />
    </>
  );
}
