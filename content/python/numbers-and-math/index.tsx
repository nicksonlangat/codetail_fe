import { IntegersSection } from "./IntegersSection";
import { FloatsSection } from "./FloatsSection";
import { ArithmeticSection } from "./ArithmeticSection";
import { MathFunctionsSection } from "./MathFunctionsSection";
import { DecimalSection } from "./DecimalSection";
import { PatternsSection } from "./PatternsSection";

export const toc = [
  { id: "integers", title: "Integers" },
  { id: "floats", title: "Floats and why they lie" },
  { id: "arithmetic", title: "Arithmetic operators" },
  { id: "math-functions", title: "Math functions" },
  { id: "decimal", title: "Decimal: exact math" },
  { id: "real-world-patterns", title: "Real-world patterns" },
];

export default function NumbersAndMathArticle() {
  return (
    <>
      <IntegersSection />
      <FloatsSection />
      <ArithmeticSection />
      <MathFunctionsSection />
      <DecimalSection />
      <PatternsSection />
    </>
  );
}
