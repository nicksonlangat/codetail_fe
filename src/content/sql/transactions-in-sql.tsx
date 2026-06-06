import { TransactionBasicsSection } from "./transactions-in-sql/TransactionBasicsSection";
import { SavepointSection } from "./transactions-in-sql/SavepointSection";
import { IsolationLevelsSection } from "./transactions-in-sql/IsolationLevelsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "begin-commit-rollback", title: "BEGIN, COMMIT, ROLLBACK" },
  { id: "savepoints", title: "SAVEPOINTs" },
  { id: "isolation-levels", title: "Isolation Levels" },
  { id: "summary", title: "Summary" },
];

export default function TransactionsInSQLArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A database without transactions is dangerous. Two statements that must both succeed or both fail — like debiting one account and crediting another — can be split apart by a crash, a network error, or a constraint violation. Transactions prevent that.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          But transactions do more than group statements. They also control what a transaction can see of other transactions running at the same time. Isolation levels determine whether you can read uncommitted data, whether your reads stay consistent within a transaction, and how much contention you accept in exchange for correctness.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          By the end of this article you will know how BEGIN, COMMIT, and ROLLBACK work, how SAVEPOINTs let you partially undo work inside a transaction, and what each isolation level prevents and costs.
        </p>
      </section>

      <TransactionBasicsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <SavepointSection />
      <IsolationLevelsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🔒", label: "Transactions are all-or-nothing", desc: "BEGIN starts a transaction. COMMIT makes all changes permanent. ROLLBACK undoes all changes back to BEGIN. There is no partial outcome." },
            { icon: "⚡", label: "Autocommit wraps every statement", desc: "Without an explicit BEGIN, each statement is its own transaction that commits immediately. Use BEGIN when multiple statements must succeed or fail together." },
            { icon: "📍", label: "SAVEPOINTs create rollback checkpoints", desc: "SAVEPOINT marks a position inside a transaction. ROLLBACK TO SAVEPOINT undoes only the work since that point. The outer transaction still needs COMMIT." },
            { icon: "👁️", label: "READ COMMITTED is the safe default", desc: "Prevents dirty reads. Each statement sees committed data at the moment it runs. Non-repeatable reads are possible but rarely matter in practice." },
            { icon: "📸", label: "REPEATABLE READ gives a consistent snapshot", desc: "The transaction sees committed data as of when it started. Rereading the same row always returns the same value within the transaction." },
            { icon: "🎯", label: "SERIALIZABLE prevents all anomalies", desc: "Full isolation: no dirty reads, no non-repeatable reads, no phantoms. Use it when correctness absolutely requires it — it reduces throughput under concurrent load." },
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
