import { BasicCTEsSection } from "./ctes/BasicCTEsSection";
import { RecursiveCTEsSection } from "./ctes/RecursiveCTEsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "basic-ctes", title: "The WITH Clause" },
  { id: "recursive-ctes", title: "Recursive CTEs" },
  { id: "summary", title: "Summary" },
];

export default function CTEsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Complex queries tend to grow in two directions: outward with more joins, and inward with nested subqueries. Both directions make queries hard to read. CTEs solve the inward problem by giving subqueries names.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A CTE is a named subquery defined at the top of a query with the WITH clause. Instead of nesting logic inside FROM or WHERE, you name each piece of logic and reference it by name. The query reads top to bottom like a series of steps.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          CTEs also unlock one capability that ordinary subqueries cannot express: recursion. Recursive CTEs let a query reference its own previous output, which is the standard way to traverse hierarchies and generate sequences in SQL.
        </p>
      </section>

      <BasicCTEsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <RecursiveCTEsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "📋", label: "WITH names a subquery", desc: "A CTE assigns a name to a subquery so the main query can reference it. The result is identical to an inline derived table — the difference is readability." },
            { icon: "🔗", label: "Chain CTEs with commas", desc: "Define multiple CTEs in a single WITH clause. Each one can reference those defined before it. The main query runs last and can reference all of them." },
            { icon: "🔄", label: "RECURSIVE enables self-reference", desc: "WITH RECURSIVE lets a CTE reference itself. The anchor member produces starting rows, the recursive member extends them. Repeats until no new rows are added." },
            { icon: "🌳", label: "Hierarchies are the main use case", desc: "Org charts, category trees, threaded comments — any table where rows reference other rows in the same table is cleanly traversed with a recursive CTE." },
            { icon: "📅", label: "Sequences fill report gaps", desc: "Generate a date or number series with recursion, then LEFT JOIN your data to it. Days with no activity still appear in the result with zero values." },
            { icon: "⚠️", label: "Guard against infinite loops", desc: "Cycles in the data cause recursive CTEs to run forever. Track depth and add a WHERE depth < N condition as a safeguard when the data could contain cycles." },
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
