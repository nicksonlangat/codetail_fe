import { ComparisonOperatorsSection } from "./booleans-and-conditions/ComparisonOperatorsSection";
import { LogicalOperatorsSection } from "./booleans-and-conditions/LogicalOperatorsSection";
import { ConditionalsSection } from "./booleans-and-conditions/ConditionalsSection";
import { PatternsSection } from "./booleans-and-conditions/PatternsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "comparison-operators", title: "Comparison operators" },
  { id: "logical-operators", title: "Logical operators" },
  { id: "conditionals", title: "Conditionals" },
  { id: "real-world-patterns", title: "Real-world patterns" },
  { id: "summary", title: "Summary" },
];

export default function BooleansAndConditionsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Booleans are the simplest type in Python. There are exactly two values:{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">True</code> and{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">False</code>.
          But the logic built around them — comparisons, short-circuits, truthiness — is where
          most Python bugs live and most expressive code gets written.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers comparison and logical operators in depth, including two behaviors
          that regularly surprise programmers: chained comparisons and the fact that{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">and</code> and{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">or</code> don&apos;t
          return booleans.
        </p>
      </section>

      <ComparisonOperatorsSection />
      <LogicalOperatorsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <ConditionalsSection />
      <PatternsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "⛓️",
              label: "Chain comparisons",
              desc: "0 < x < 10 works in Python. Each link evaluates once and short-circuits on the first false result.",
            },
            {
              icon: "↩️",
              label: "and/or return values",
              desc: "and returns the first falsy value or the last value. or returns the first truthy value or the last value.",
            },
            {
              icon: "⚡",
              label: "Short-circuit evaluation",
              desc: "Python stops evaluating as soon as the result is known. The right side may never run.",
            },
            {
              icon: "🚪",
              label: "Guard clauses, not nesting",
              desc: "Handle edge cases at the top and return early. Flat code is easier to read than deeply nested if/elif chains.",
            },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
              <span className="text-lg flex-shrink-0">{icon}</span>
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
