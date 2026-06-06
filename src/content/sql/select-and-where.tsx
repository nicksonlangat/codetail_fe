import { SelectStatementSection } from "./select-and-where/SelectStatementSection";
import { WhereClauseSection } from "./select-and-where/WhereClauseSection";
import { CombiningConditionsSection } from "./select-and-where/CombiningConditionsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "select-statement", title: "The SELECT Statement" },
  { id: "where-clause", title: "The WHERE Clause" },
  { id: "combining-conditions", title: "Combining Conditions" },
  { id: "summary", title: "Summary" },
];

export default function SelectAndWhereArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          SQL is a language for asking questions about data. Every query starts with what you want (SELECT), where to find it (FROM), and which rows to include (WHERE). Understanding these three clauses precisely is the foundation everything else builds on.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Most SQL tutorials show you syntax. This article shows you what actually happens: what SELECT returns, how WHERE evaluates each row, and why certain filter expressions silently return nothing when you expect results.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          By the end you will know every operator available in WHERE, how to combine conditions correctly, and the one NULL behavior that catches everyone by surprise.
        </p>
      </section>

      <SelectStatementSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <WhereClauseSection />
      <CombiningConditionsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🔍", label: "SELECT specifies columns", desc: "SELECT picks which columns appear in the result. Use * for all columns, list names to restrict. Column order in SELECT matches output order." },
            { icon: "📝", label: "FROM specifies the table", desc: "FROM tells SQL where to read rows. Every SELECT needs a FROM (except for computing expressions)." },
            { icon: "⚡", label: "WHERE filters rows", desc: "WHERE evaluates a condition for each row. Only rows where the condition is TRUE are returned. FALSE and UNKNOWN rows are excluded." },
            { icon: "🔗", label: "LIKE matches patterns", desc: "% matches zero or more characters, _ matches exactly one. LIKE 'A%' finds all values starting with A. Most databases are case-sensitive by default." },
            { icon: "✅", label: "IN is shorthand for OR", desc: "WHERE id IN (1, 2, 3) is equivalent to WHERE id = 1 OR id = 2 OR id = 3. IN is cleaner for more than two values." },
            { icon: "🚫", label: "NULL requires IS NULL, not =", desc: "WHERE email = NULL never matches any row. NULL is not equal to anything, including itself. Use IS NULL or IS NOT NULL." },
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
