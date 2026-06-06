import { AggregateFunctionsSection } from "./aggregations/AggregateFunctionsSection";
import { GroupBySection } from "./aggregations/GroupBySection";
import { HavingSection } from "./aggregations/HavingSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "aggregate-functions", title: "Aggregate Functions" },
  { id: "group-by", title: "GROUP BY" },
  { id: "having", title: "HAVING" },
  { id: "summary", title: "Summary" },
];

export default function AggregationsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Most useful queries do not return raw rows. They summarize data: total revenue, average order value, number of users per country. Aggregations are how you get from individual rows to those summaries.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The mechanics involve three things working together: aggregate functions that collapse rows into values, GROUP BY that controls which rows collapse together, and HAVING that filters those groups after they form.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          By the end of this article you will know what each aggregate function does with NULLs, why the GROUP BY rule exists, and the exact difference between WHERE and HAVING — including why one can reference aggregate results and the other cannot.
        </p>
      </section>

      <AggregateFunctionsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <GroupBySection />
      <HavingSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "📊", label: "Aggregate functions collapse rows", desc: "COUNT, SUM, AVG, MIN, MAX each take a set of rows and return one value. Without GROUP BY, they collapse the entire table into a single row." },
            { icon: "🚫", label: "COUNT(*) vs COUNT(column)", desc: "COUNT(*) counts every row. COUNT(column) skips NULLs. These return different numbers whenever the column has NULL values." },
            { icon: "🗂️", label: "GROUP BY splits rows into groups", desc: "Every unique combination of GROUP BY column values becomes one group. Aggregate functions run separately on each group." },
            { icon: "📋", label: "SELECT columns must be in GROUP BY", desc: "Any column in SELECT that is not inside an aggregate must appear in GROUP BY. Otherwise the database cannot determine which value to show." },
            { icon: "⚡", label: "WHERE runs before grouping", desc: "WHERE filters individual rows before groups form. It cannot reference COUNT or SUM because those values do not exist yet." },
            { icon: "🎯", label: "HAVING runs after grouping", desc: "HAVING filters groups using aggregate results. Use it when your condition depends on COUNT, SUM, AVG, MIN, or MAX." },
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
