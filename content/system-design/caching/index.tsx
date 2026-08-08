import { WhatIsCachingSection } from "./WhatIsCachingSection";
import { EvictionSection } from "./EvictionSection";
import { InvalidationSection } from "./InvalidationSection";
import { WriteStrategiesSection } from "./WriteStrategiesSection";

export const toc = [
  { id: "why-caching-matters", title: "Why Caching Matters" },
  { id: "eviction-policies", title: "Eviction Policies" },
  { id: "cache-invalidation", title: "Cache Invalidation" },
  { id: "write-strategies", title: "Write Strategies" },
];

export default function CachingArticle() {
  return (
    <>
      <WhatIsCachingSection />
      <EvictionSection />
      <InvalidationSection />
      <WriteStrategiesSection />
    </>
  );
}
