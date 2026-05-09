import { WhatACIDSection } from "./acid-transactions/WhatACIDSection";
import { LimitsSection } from "./acid-transactions/LimitsSection";
import { PracticalSection } from "./acid-transactions/PracticalSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-acid", title: "What ACID Actually Guarantees" },
  { id: "limits", title: "What Transactions Do Not Protect" },
  { id: "practical", title: "Using Transactions Correctly" },
  { id: "summary", title: "Summary" },
];

export default function ACIDTransactionsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          ACID transactions are one of the most valuable tools in a backend engineer's
          toolkit and one of the most misunderstood. Developers wrap code in a transaction
          and assume it is now correct and safe. Sometimes it is. Often it is not — because
          ACID protects against specific failure modes, not all of them.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Atomicity prevents partial writes. Consistency enforces database-level constraints.
          Isolation controls what concurrent transactions can see. Durability ensures committed
          data survives crashes. None of these protect against logical bugs, cross-service
          failures, or the race conditions that READ COMMITTED allows.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article explains precisely what each ACID property guarantees, what transactions
          do not protect against, and how to use them correctly in production applications.
        </p>
      </section>

      <WhatACIDSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <LimitsSection />
      <PracticalSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "⚛️",
              label: "Atomicity: all-or-nothing at commit",
              desc: "All writes in a transaction commit together or none do. A crash between two related updates rolls back both. Atomicity does not validate the correctness of the values being written.",
            },
            {
              icon: "✅",
              label: "Consistency: constraints hold at commit",
              desc: "The database enforces foreign keys, NOT NULL, UNIQUE, and CHECK constraints when a transaction commits. Invariants not encoded as constraints are not enforced.",
            },
            {
              icon: "🔒",
              label: "Isolation level determines race condition protection",
              desc: "READ COMMITTED (PostgreSQL default) prevents dirty reads only. It does not prevent lost updates. SERIALIZABLE prevents all anomalies at the cost of throughput.",
            },
            {
              icon: "💾",
              label: "Durability: committed data survives crashes",
              desc: "PostgreSQL writes to the WAL before confirming a commit. A crash after commit does not lose the data. Durability does not protect against disk failure — that requires replication.",
            },
            {
              icon: "🚫",
              label: "Never call external services inside a transaction",
              desc: "An HTTP call inside a transaction holds database locks for the duration of the network round-trip. If the call hangs, rows are locked indefinitely. Move external calls outside the transaction.",
            },
            {
              icon: "🔄",
              label: "Sagas for cross-service workflows",
              desc: "Transactions only cover a single database. For workflows spanning multiple services, use the Saga pattern: a sequence of local transactions each with a compensating action that reverses its effect on failure.",
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
