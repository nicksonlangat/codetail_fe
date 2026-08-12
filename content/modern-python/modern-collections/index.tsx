import { DictMergeSection } from "./DictMergeSection";
import { CounterArithmeticSection } from "./CounterArithmeticSection";
import { BatchedAndPairwiseSection } from "./BatchedAndPairwiseSection";
import { ChainMapSection } from "./ChainMapSection";

export const toc = [
  { id: "dict-merge", title: "Dict merge with | (3.9)" },
  { id: "counter-arithmetic", title: "Counter arithmetic and most_common" },
  { id: "batched-and-pairwise", title: "batched (3.12) and pairwise (3.10)" },
  { id: "chainmap", title: "ChainMap: layered lookup" },
];

export default function ModernCollectionsArticle() {
  return (
    <>
      <DictMergeSection />
      <CounterArithmeticSection />
      <BatchedAndPairwiseSection />
      <ChainMapSection />
    </>
  );
}
