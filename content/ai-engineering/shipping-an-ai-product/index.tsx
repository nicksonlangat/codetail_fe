import { TheProductSection } from "./TheProductSection";
import { TheArchitectureSection } from "./TheArchitectureSection";
import { CostAndLatencyBudgetSection } from "./CostAndLatencyBudgetSection";
import { WhatShipDayActuallyRequiresSection } from "./WhatShipDayActuallyRequiresSection";

export const toc = [
  { id: "the-product-were-building", title: "A support assistant that answers from docs and can actually look things up" },
  { id: "the-architecture", title: "The request path, and everything running alongside it" },
  { id: "setting-a-cost-and-latency-budget", title: "The budget is a product decision, not an afterthought found in a bill" },
  { id: "what-ship-day-actually-requires", title: "What actually has to be true before this goes live" },
];

export default function ShippingAnAIProductArticle() {
  return (
    <>
      <TheProductSection />
      <TheArchitectureSection />
      <CostAndLatencyBudgetSection />
      <WhatShipDayActuallyRequiresSection />
    </>
  );
}
