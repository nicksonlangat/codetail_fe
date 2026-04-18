import { IntegersSection } from "./numbers-and-math/IntegersSection";
import { FloatsSection } from "./numbers-and-math/FloatsSection";
import { ArithmeticSection } from "./numbers-and-math/ArithmeticSection";
import { MathFunctionsSection } from "./numbers-and-math/MathFunctionsSection";
import { DecimalSection } from "./numbers-and-math/DecimalSection";
import { PatternsSection } from "./numbers-and-math/PatternsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "integers", title: "Integers" },
  { id: "floats", title: "Floats and why they lie" },
  { id: "arithmetic", title: "Arithmetic operators" },
  { id: "math-functions", title: "Math functions" },
  { id: "decimal", title: "Decimal: exact math" },
  { id: "real-world-patterns", title: "Real-world patterns" },
  { id: "summary", title: "Summary" },
];

export default function NumbersAndMathArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Python has two numeric types you&apos;ll use constantly: integers and floats. They
          look similar but behave very differently. One is exact and unbounded. The other is
          approximate and occasionally wrong in ways that will surprise you.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers both from first principles, every arithmetic operator and its
          gotchas, the full standard math toolkit, and when to reach for{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">Decimal</code>{" "}
          instead of a float. By the end, numbers in Python will hold no surprises.
        </p>
      </section>

      <IntegersSection />
      <FloatsSection />
      <ArithmeticSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <MathFunctionsSection />
      <DecimalSection />
      <PatternsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "∞",
              label: "Integers are exact",
              desc: "No overflow, no precision loss, no size limit. Use int for counting, indexing, and anything discrete.",
            },
            {
              icon: "≈",
              label: "Floats are approximate",
              desc: "0.1 + 0.2 is not 0.3. Use math.isclose() to compare floats. Never use == on floats.",
            },
            {
              icon: "/",
              label: "/ always returns float",
              desc: "Use // for integer (floor) division. Floor division rounds toward negative infinity, not zero.",
            },
            {
              icon: "$",
              label: "Money needs Decimal",
              desc: "For currency and exact decimals, use decimal.Decimal('1.10'), not float 1.10.",
            },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
              <span className="text-lg font-mono text-primary flex-shrink-0 w-6 text-center">{icon}</span>
              <div>
                <p className="text-[13px] font-semibold mb-0.5">{label}</p>
                <p className="text-[12px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
