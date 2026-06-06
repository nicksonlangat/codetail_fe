import { HowJoinsWorkSection } from "./joins/HowJoinsWorkSection";
import { JoinTypesSection } from "./joins/JoinTypesSection";
import { PracticalPatternsSection } from "./joins/PracticalPatternsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "how-joins-work", title: "How a JOIN Works" },
  { id: "join-types", title: "JOIN Types" },
  { id: "practical-patterns", title: "Practical Patterns" },
  { id: "summary", title: "Summary" },
];

export default function JoinsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A database with a single table can only tell you so much. Real data lives in multiple tables connected by relationships. JOINs are how you query across those relationships.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The idea is simple: given a condition, combine rows from two tables into one result. But the choice of join type determines what happens to rows that have no match on the other side, and getting that wrong is one of the most common sources of silent bugs in SQL.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          By the end of this article you will understand how joins match rows, what each join type returns, and when to use each one. You will also know the one LEFT JOIN mistake that turns it silently into an INNER JOIN.
        </p>
      </section>

      <HowJoinsWorkSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <JoinTypesSection />
      <PracticalPatternsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🔗", label: "JOIN matches rows on a condition", desc: "The ON clause defines which rows from each table pair together. Rows where the condition is false do not appear in the result." },
            { icon: "🎯", label: "INNER JOIN keeps only matches", desc: "Rows with no match in the other table are excluded from both sides. JOIN and INNER JOIN are identical." },
            { icon: "⬅️", label: "LEFT JOIN keeps all left rows", desc: "Every row from the left table appears. If there is no match, right-table columns are NULL. Use this for optional relationships." },
            { icon: "🔍", label: "NULL check finds unmatched rows", desc: "LEFT JOIN ... WHERE right_table.id IS NULL returns rows that have no match. Classic pattern for 'find users with no orders'." },
            { icon: "📎", label: "Use aliases to reduce clutter", desc: "Short aliases like u for users and o for orders make multi-table queries readable. Required when joining a table to itself." },
            { icon: "⚠️", label: "WHERE filters after the join", desc: "Filtering on a right-table column in WHERE converts a LEFT JOIN into an INNER JOIN. Move that filter into ON to preserve unmatched rows." },
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
