import { PerplexitySection } from "./PerplexitySection";
import { WhatPerplexityMissesSection } from "./WhatPerplexityMissesSection";
import { BenchmarkSuitesSection } from "./BenchmarkSuitesSection";
import { HallucinationSection } from "./HallucinationSection";

export const toc = [
  { id: "perplexity", title: "Perplexity: cross-entropy loss, made interpretable" },
  { id: "what-perplexity-misses", title: "What perplexity misses" },
  { id: "benchmark-suites", title: "Benchmark suites: MMLU and friends" },
  { id: "hallucination", title: "Why hallucination resists easy detection" },
];

export default function EvaluatingLLMsArticle() {
  return (
    <>
      <PerplexitySection />
      <WhatPerplexityMissesSection />
      <BenchmarkSuitesSection />
      <HallucinationSection />
    </>
  );
}
