import { TheProblemAttentionSolvesSection } from "./TheProblemAttentionSolvesSection";
import { QueryKeyValueSection } from "./QueryKeyValueSection";
import { WorkedExampleSection } from "./WorkedExampleSection";
import { WhySelfAttentionMattersSection } from "./WhySelfAttentionMattersSection";

export const toc = [
  { id: "the-problem-attention-solves", title: "The problem a feedforward layer can't solve" },
  { id: "query-key-value", title: "Query, key, and value: three questions per token" },
  { id: "worked-example", title: "Tracing the arithmetic by hand" },
  { id: "why-self-attention-matters", title: "One head isn't enough, and the cost that creates" },
];

export default function AttentionArticle() {
  return (
    <>
      <TheProblemAttentionSolvesSection />
      <QueryKeyValueSection />
      <WorkedExampleSection />
      <WhySelfAttentionMattersSection />
    </>
  );
}
