import { AttentionsQuadraticCostSection } from "./AttentionsQuadraticCostSection";
import { WhatTheKVCacheActuallyCachesSection } from "./WhatTheKVCacheActuallyCachesSection";
import { TheMemoryCostOfTheCacheSection } from "./TheMemoryCostOfTheCacheSection";
import { WhyDoublingContextIsntFreeSection } from "./WhyDoublingContextIsntFreeSection";

export const toc = [
  { id: "attentions-quadratic-cost", title: "Attention's quadratic cost: every token against every token" },
  { id: "what-the-kv-cache-actually-caches", title: "What the KV cache actually caches" },
  { id: "the-memory-cost-of-the-cache", title: "The memory cost of the cache itself" },
  { id: "why-doubling-context-isnt-free", title: "Why doubling context length isn't a free upgrade" },
];

export default function ContextWindowsAndKVCacheArticle() {
  return (
    <>
      <AttentionsQuadraticCostSection />
      <WhatTheKVCacheActuallyCachesSection />
      <TheMemoryCostOfTheCacheSection />
      <WhyDoublingContextIsntFreeSection />
    </>
  );
}
