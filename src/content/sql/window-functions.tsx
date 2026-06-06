import { OverClauseSection } from "./window-functions/OverClauseSection";
import { RankingFunctionsSection } from "./window-functions/RankingFunctionsSection";
import { OffsetAndAggregateSection } from "./window-functions/OffsetAndAggregateSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "over-clause", title: "The OVER Clause" },
  { id: "ranking-functions", title: "Ranking Functions" },
  { id: "offset-and-aggregate", title: "LAG, LEAD, and Aggregate Windows" },
  { id: "summary", title: "Summary" },
];

export default function WindowFunctionsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          GROUP BY is powerful, but it comes with a cost: every row collapses into its group and disappears from the result. Sometimes you want the aggregate value alongside the original row. That is what window functions are for.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A window function computes a value across a set of rows related to the current row — the window. Each row gets its own computed value, and no rows are removed. Running totals, rankings, month-over-month comparisons: all of these are window function problems.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          By the end of this article you will understand OVER, PARTITION BY, and ORDER BY within a window, the difference between ROW_NUMBER, RANK, and DENSE_RANK, and how LAG and LEAD let you reference adjacent rows.
        </p>
      </section>

      <OverClauseSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <RankingFunctionsSection />
      <OffsetAndAggregateSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🪟", label: "OVER defines the window", desc: "Every window function needs OVER. Empty OVER means the whole result set. PARTITION BY splits into groups. ORDER BY inside OVER controls frame and ranking order." },
            { icon: "🔢", label: "ROW_NUMBER always gives unique ranks", desc: "No two rows share a ROW_NUMBER. Use it when you need exactly N rows per group. Ties get arbitrary but stable numbers within a query run." },
            { icon: "🏆", label: "RANK vs DENSE_RANK handles ties differently", desc: "RANK skips numbers after a tie (1, 1, 3). DENSE_RANK does not (1, 1, 2). Use DENSE_RANK when you want a continuous ranking without gaps." },
            { icon: "🔝", label: "Top N per group uses ROW_NUMBER in a CTE", desc: "Compute ROW_NUMBER OVER (PARTITION BY group ORDER BY value DESC), then wrap in a CTE and filter WHERE rn <= N." },
            { icon: "↔️", label: "LAG and LEAD access adjacent rows", desc: "LAG looks back, LEAD looks forward. Both return NULL at the edges unless you provide a default. Use them for period-over-period comparisons." },
            { icon: "📈", label: "SUM OVER with ORDER BY gives a running total", desc: "Adding ORDER BY inside OVER changes an aggregate from whole-partition to a growing frame. ROWS BETWEEN lets you define rolling windows explicitly." },
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
