import { WhyRateLimitSection } from "./WhyRateLimitSection";
import { AlgorithmsSection } from "./AlgorithmsSection";
import { ImplementationSection } from "./ImplementationSection";

export const toc = [
  { id: "why-rate-limit", title: "Why Rate Limiting Exists" },
  { id: "algorithms", title: "Rate Limiting Algorithms" },
  { id: "implementation", title: "Implementation: Distributed Rate Limiting" },
];

export default function RateLimitingArticle() {
  return (
    <>
      <WhyRateLimitSection />
      <AlgorithmsSection />
      <ImplementationSection />
    </>
  );
}
