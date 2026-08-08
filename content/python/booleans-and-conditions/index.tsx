import { ComparisonOperatorsSection } from "./ComparisonOperatorsSection";
import { LogicalOperatorsSection } from "./LogicalOperatorsSection";
import { ConditionalsSection } from "./ConditionalsSection";
import { PatternsSection } from "./PatternsSection";

export const toc = [
  { id: "comparison-operators", title: "Comparison operators" },
  { id: "logical-operators", title: "Logical operators" },
  { id: "conditionals", title: "Conditionals" },
  { id: "real-world-patterns", title: "Real-world patterns" },
];

export default function BooleansAndConditionsArticle() {
  return (
    <>
      <ComparisonOperatorsSection />
      <LogicalOperatorsSection />
      <ConditionalsSection />
      <PatternsSection />
    </>
  );
}
