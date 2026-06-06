import { ColumnConstraintsSection } from "./constraints/ColumnConstraintsSection";
import { ForeignKeySection } from "./constraints/ForeignKeySection";
import { DeferrableSection } from "./constraints/DeferrableSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "column-constraints", title: "Column Constraints" },
  { id: "foreign-keys", title: "Foreign Keys" },
  { id: "deferrable-constraints", title: "Deferrable Constraints" },
  { id: "summary", title: "Summary" },
];

export default function ConstraintsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Application code validates data before writing it to the database. But applications have bugs, queries run directly against the database, and multiple services write to the same tables. Constraints are the last line of defense — rules that the database itself enforces on every write, regardless of where it came from.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A constraint that lives in the database is a guarantee. A validation that lives only in application code is a hope.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          By the end of this article you will know what each constraint type prevents, how foreign key actions control what happens when a referenced row is deleted, and how deferrable constraints let you temporarily relax rules within a transaction.
        </p>
      </section>

      <ColumnConstraintsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <ForeignKeySection />
      <DeferrableSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🛡️", label: "Constraints enforce rules at the boundary", desc: "NOT NULL, UNIQUE, CHECK, and PRIMARY KEY run on every INSERT and UPDATE. Invalid data is rejected before it reaches the table, regardless of which application wrote it." },
            { icon: "🔑", label: "PRIMARY KEY = UNIQUE + NOT NULL", desc: "Every table should have a primary key. The database indexes it automatically. Use SERIAL or GENERATED ALWAYS AS IDENTITY for auto-incrementing integer keys." },
            { icon: "✅", label: "CHECK passes on TRUE or UNKNOWN", desc: "A CHECK constraint only rejects a row when the expression is FALSE. If any column in the expression is NULL, the result is UNKNOWN and the row passes." },
            { icon: "🔗", label: "Foreign keys prevent orphaned references", desc: "REFERENCES enforces that every foreign key value exists in the referenced table. Always index foreign key columns — unindexed foreign keys cause sequential scans on every parent delete." },
            { icon: "🗑️", label: "ON DELETE controls what happens to children", desc: "CASCADE deletes children automatically. SET NULL preserves them with a NULL reference. RESTRICT (default) blocks the parent delete entirely." },
            { icon: "⏱️", label: "DEFERRABLE moves checks to COMMIT time", desc: "DEFERRABLE INITIALLY DEFERRED lets you temporarily violate a constraint within a transaction. Useful for circular references and bulk reordering of unique values." },
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
