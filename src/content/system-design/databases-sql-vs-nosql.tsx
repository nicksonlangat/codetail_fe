import { RelationalSection } from "./databases-sql-vs-nosql/RelationalSection";
import { NoSQLTypesSection } from "./databases-sql-vs-nosql/NoSQLTypesSection";
import { ACIDvsBaseSection } from "./databases-sql-vs-nosql/ACIDvsBaseSection";
import { ChoosingSection } from "./databases-sql-vs-nosql/ChoosingSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "relational-databases", title: "Relational Databases and ACID" },
  { id: "nosql-types", title: "NoSQL: Four Different Models" },
  { id: "acid-vs-base", title: "ACID vs BASE" },
  { id: "choosing-a-database", title: "Choosing the Right Database" },
  { id: "summary", title: "Summary" },
];

export default function DatabasesArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The choice of database is one of the most consequential architectural decisions you
          will make. It determines what queries are fast, what consistency guarantees you can
          offer, how your schema evolves, and how your system scales. Getting it right early
          saves years of migration pain.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          The framing of SQL versus NoSQL is misleading. It implies a single axis when there
          are actually several: consistency model, data model, query flexibility, and scale
          characteristics. A key-value store, a document database, and a columnar database
          are all called NoSQL but have almost nothing else in common.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers the relational model and ACID guarantees, the four main NoSQL
          data models, the ACID versus BASE consistency trade-off, and a practical guide to
          choosing the right database for your access patterns.
        </p>
      </section>

      <RelationalSection />
      <NoSQLTypesSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <ACIDvsBaseSection />
      <ChoosingSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🏦",
              label: "ACID is not optional for financial data",
              desc: "Atomicity, Consistency, Isolation, Durability. If money or inventory is involved, you need a database that guarantees these properties.",
            },
            {
              icon: "📄",
              label: "NoSQL is four different models, not one",
              desc: "Document, key-value, columnar, and graph databases each solve a different problem. Choosing one requires understanding which problem you have.",
            },
            {
              icon: "🔄",
              label: "BASE trades consistency for availability",
              desc: "Eventually consistent systems always respond, even if the data is stale. This is acceptable for likes and caches, not for bank balances.",
            },
            {
              icon: "🔍",
              label: "Access patterns drive the choice",
              desc: "The right database is the one that makes your most common queries fast and cheap. Design your data model around how you read, not how data is related.",
            },
            {
              icon: "🐘",
              label: "PostgreSQL is a strong default",
              desc: "ACID, JSON columns, full-text search, and decades of operational tooling. Start here and switch only when you have a concrete reason to.",
            },
            {
              icon: "🔴",
              label: "Polyglot persistence is a tool, not a goal",
              desc: "Using multiple databases adds operational complexity. Only add a second store when the first genuinely cannot do the job, not out of architectural fashion.",
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
