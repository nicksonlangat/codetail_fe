import { CreatingSetsSection } from "./sets/CreatingSetsSection";
import { MembershipSection } from "./sets/MembershipSection";
import { SetOperationsSection } from "./sets/SetOperationsSection";
import { ModifyingSection } from "./sets/ModifyingSection";
import { PatternsSection } from "./sets/PatternsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction",   title: "Introduction" },
  { id: "creating-sets",  title: "Creating sets" },
  { id: "membership",     title: "Membership testing" },
  { id: "set-operations", title: "Set operations" },
  { id: "modifying-sets", title: "Modifying sets" },
  { id: "patterns",       title: "Real-world patterns" },
  { id: "summary",        title: "Summary" },
];

export default function SetsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Sets answer one question better than any other data structure: is this item
          present? Membership testing on a list is O(n) — it scans every element. On a
          set it is O(1). That difference is irrelevant for ten items and decisive for
          ten million.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers set creation, fast membership testing, the four set math
          operations with interactive Venn diagrams, and the patterns that make sets
          indispensable in real Python code.
        </p>
      </section>

      <CreatingSetsSection />
      <MembershipSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <SetOperationsSection />
      <ModifyingSection />
      <PatternsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔵",
              label: "Uniqueness is automatic",
              desc: "Every element appears once. Adding a duplicate is silently ignored. Use set() to deduplicate any iterable in one call.",
            },
            {
              icon: "⚡",
              label: "O(1) membership",
              desc: "x in my_set is a hash lookup — constant time. Convert lists to sets when you need to test membership more than once.",
            },
            {
              icon: "∩",
              label: "Set math is built in",
              desc: "Union (|), intersection (&), difference (-), symmetric difference (^). Use operators for sets, methods for any iterable.",
            },
            {
              icon: "🔒",
              label: "frozenset for immutability",
              desc: "frozenset is hashable — use it as a dict key or inside another set when you need a set-like structure that cannot change.",
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
