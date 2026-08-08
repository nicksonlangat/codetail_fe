import { VerticalSection } from "./VerticalSection";
import { HorizontalSection } from "./HorizontalSection";
import { LoadBalancerSection } from "./LoadBalancerSection";
import { PatternsSection } from "./PatternsSection";

export const toc = [
  { id: "vertical-scaling", title: "Vertical Scaling: Bigger Hardware" },
  { id: "horizontal-scaling", title: "Horizontal Scaling: More Servers" },
  { id: "load-balancer-algorithms", title: "Load Balancer Algorithms" },
  { id: "scaling-patterns", title: "Real-World Scaling Patterns" },
];

export default function ScalabilityFundamentalsArticle() {
  return (
    <>
      <VerticalSection />
      <HorizontalSection />
      <LoadBalancerSection />
      <PatternsSection />
    </>
  );
}
