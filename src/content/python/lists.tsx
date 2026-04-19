import { CreatingListsSection } from "./lists/CreatingListsSection";
import { AccessingListsSection } from "./lists/AccessingListsSection";
import { ModifyingListsSection } from "./lists/ModifyingListsSection";
import { SortingSection } from "./lists/SortingSection";
import { ComprehensionsSection } from "./lists/ComprehensionsSection";
import { PatternsSection } from "./lists/PatternsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "creating-lists", title: "Creating lists" },
  { id: "accessing-lists", title: "Indexing and slicing" },
  { id: "modifying-lists", title: "Modifying lists" },
  { id: "sorting", title: "Sorting" },
  { id: "comprehensions", title: "List comprehensions" },
  { id: "real-world-patterns", title: "Real-world patterns" },
  { id: "summary", title: "Summary" },
];

export default function ListsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Lists are Python&apos;s most used data structure. Most programs spend more time
          manipulating lists than any other type. Get fluent with them and a large portion
          of everyday Python becomes effortless.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers everything: how to create and access lists, every mutation
          method, sorting with custom keys, and list comprehensions. Plus the real-world
          patterns that show up in production code daily.
        </p>
      </section>

      <CreatingListsSection />
      <AccessingListsSection />
      <ModifyingListsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <SortingSection />
      <ComprehensionsSection />
      <PatternsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "📋",
              label: "Mutable and ordered",
              desc: "Lists preserve insertion order and can be changed in place. Use them when sequence and mutability both matter.",
            },
            {
              icon: "⚠️",
              label: "Assignment is not a copy",
              desc: "b = a gives two names to the same list. Use b = a.copy() or b = a[:] when you need an independent copy.",
            },
            {
              icon: "🔑",
              label: "Sort with key=",
              desc: "sorted(items, key=len) sorts by length. key= accepts any callable. sort() modifies in place; sorted() returns a new list.",
            },
            {
              icon: "⚡",
              label: "Comprehensions over loops",
              desc: "[x*2 for x in items if x > 0] is faster and cleaner than an equivalent for loop for simple transformations.",
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
