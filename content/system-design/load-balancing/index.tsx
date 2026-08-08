import { WhatIsSection } from "./WhatIsSection";
import { AlgorithmsSection } from "./AlgorithmsSection";
import { HealthChecksSection } from "./HealthChecksSection";
import { AdvancedSection } from "./AdvancedSection";

export const toc = [
  { id: "what-is-a-load-balancer", title: "What is a load balancer?" },
  { id: "algorithms", title: "Distribution Algorithms" },
  { id: "health-checks", title: "Health Checks and Failure Handling" },
  { id: "advanced-features", title: "SSL, Sticky Sessions & Global LB" },
];

export default function LoadBalancingArticle() {
  return (
    <>
      <WhatIsSection />
      <AlgorithmsSection />
      <HealthChecksSection />
      <AdvancedSection />
    </>
  );
}
