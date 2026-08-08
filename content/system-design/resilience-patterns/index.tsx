import { FailureModesSection } from "./FailureModesSection";
import { RetryAndTimeoutSection } from "./RetryAndTimeoutSection";
import { CircuitBreakerSection } from "./CircuitBreakerSection";
import { BulkheadAndShedSection } from "./BulkheadAndShedSection";

export const toc = [
  { id: "failure-modes", title: "How Distributed Systems Fail" },
  { id: "retry-timeout", title: "Retries and Timeouts" },
  { id: "circuit-breaker", title: "Circuit Breaker" },
  { id: "bulkhead-shed", title: "Bulkheads, Shedding, Degradation" },
];

export default function ResiliencePatternsArticle() {
  return (
    <>
      <FailureModesSection />
      <RetryAndTimeoutSection />
      <CircuitBreakerSection />
      <BulkheadAndShedSection />
    </>
  );
}
