import { WhatIsSection } from "./race-conditions/WhatIsSection";
import { DatabaseSection } from "./race-conditions/DatabaseSection";
import { SolvingSection } from "./race-conditions/SolvingSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-is", title: "What a Race Condition Is" },
  { id: "database", title: "Race Conditions in Databases" },
  { id: "solving", title: "Solving Race Conditions" },
  { id: "summary", title: "Summary" },
];

export default function RaceConditionsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Race conditions are the bugs that only appear under concurrent load. A single
          request to your booking endpoint works perfectly. Two simultaneous requests from
          different users produce two bookings for the same seat. The bug is not in the
          code itself. The bug is in the assumption that reads and writes are atomic when
          they are not.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The pattern is always the same: read shared state, make a decision, write back.
          Between the read and the write, another operation reads the same state and makes
          the same decision. Both proceed. The result is incorrect. No exception is raised.
          No error is logged. The data is just wrong.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article explains the mechanics of race conditions, why the default database
          isolation level does not prevent them, and three strategies for eliminating them:
          pessimistic locking, optimistic locking, and atomic SQL.
        </p>
      </section>

      <WhatIsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <DatabaseSection />
      <SolvingSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔄",
              label: "Read-modify-write is the core pattern",
              desc: "Most race conditions follow this structure: read a value, compute a new value, write back. Under concurrency, the value changes between read and write. The second write silently discards the first.",
            },
            {
              icon: "🗄️",
              label: "READ COMMITTED does not prevent lost updates",
              desc: "PostgreSQL's default isolation level prevents dirty reads, not lost updates. Two concurrent transactions can both read and overwrite the same row at this level.",
            },
            {
              icon: "🔒",
              label: "SELECT FOR UPDATE locks at read time",
              desc: "Pessimistic locking acquires a row lock at the SELECT. Other transactions block until the current one commits. Correct for high-contention, short critical sections.",
            },
            {
              icon: "🔢",
              label: "Version columns detect conflicts at write time",
              desc: "Optimistic locking adds a version number. The UPDATE WHERE version = N fails if another transaction incremented the version first. Retry on failure. Better for low-contention workflows.",
            },
            {
              icon: "⚛️",
              label: "Atomic SQL eliminates application-level locking",
              desc: "UPDATE table SET value = value + 1 WHERE condition is atomic at the database level. No lock needed. Use wherever the business logic fits in a single SQL statement.",
            },
            {
              icon: "🌐",
              label: "Redis SET NX EX for cross-service coordination",
              desc: "Database row locks only work within a single database. Redis provides a distributed lock visible to all instances. Use a Lua script to release atomically and avoid accidental lock stealing.",
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
