import { CreatingDictsSection } from "./dictionaries/CreatingDictsSection";
import { AccessingSection } from "./dictionaries/AccessingSection";
import { IteratingSection } from "./dictionaries/IteratingSection";
import { ModifyingSection } from "./dictionaries/ModifyingSection";
import { DefaultDictSection } from "./dictionaries/DefaultDictSection";
import { ComprehensionsSection } from "./dictionaries/ComprehensionsSection";
import { PatternsSection } from "./dictionaries/PatternsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction",   title: "Introduction" },
  { id: "creating-dicts", title: "Creating dictionaries" },
  { id: "accessing",      title: "Accessing values" },
  { id: "iterating",      title: "Iterating" },
  { id: "modifying",      title: "Modifying dictionaries" },
  { id: "defaultdict",    title: "defaultdict and Counter" },
  { id: "comprehensions", title: "Dict comprehensions" },
  { id: "patterns",       title: "Real-world patterns" },
  { id: "summary",        title: "Summary" },
];

export default function DictionariesArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Dictionaries are the most versatile data structure in Python. API responses,
          configuration, grouping, counting, dispatch tables, caching — nearly every
          non-trivial program uses a dict somewhere. Understanding them deeply pays off
          immediately.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers everything from literal syntax to{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">defaultdict</code>,{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">Counter</code>,
          and the production patterns that show up in real Python code every day.
        </p>
      </section>

      <CreatingDictsSection />
      <AccessingSection />
      <IteratingSection />
      <ModifyingSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <DefaultDictSection />
      <ComprehensionsSection />
      <PatternsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "⚡",
              label: "O(1) everything",
              desc: "Key lookup, insertion, and deletion are all constant time. Use dicts whenever you need fast membership tests or keyed access.",
            },
            {
              icon: "🛡️",
              label: "Use .get() defensively",
              desc: "d[key] raises KeyError on missing keys. d.get(key, default) never does. Prefer .get() at system boundaries where the key may be absent.",
            },
            {
              icon: "📦",
              label: "defaultdict saves boilerplate",
              desc: "defaultdict(list) eliminates the if-key-not-in-dict check when building grouped structures. Counter counts any iterable with zero setup.",
            },
            {
              icon: "🔄",
              label: "Comprehensions for transforms",
              desc: "{k: v for k, v in items.items() if condition} filters and transforms in one expression. Use dict(zip(keys, values)) to build from two lists.",
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
