import { CreatingTuplesSection } from "./tuples/CreatingTuplesSection";
import { UnpackingSection } from "./tuples/UnpackingSection";
import { ImmutabilitySection } from "./tuples/ImmutabilitySection";
import { NamedTupleSection } from "./tuples/NamedTupleSection";
import { HashabilitySection } from "./tuples/HashabilitySection";
import { WhenToUseSection } from "./tuples/WhenToUseSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction",    title: "Introduction" },
  { id: "creating-tuples", title: "Creating tuples" },
  { id: "unpacking",       title: "Packing and unpacking" },
  { id: "immutability",    title: "Immutability" },
  { id: "named-tuples",    title: "Named tuples" },
  { id: "hashability",     title: "Hashability" },
  { id: "when-to-use",     title: "Tuples vs lists" },
  { id: "summary",         title: "Summary" },
];

export default function TuplesArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Tuples are everywhere in Python. Functions return them. Loops iterate them.
          Dictionaries use them as keys. Yet most Python courses treat tuples as
          &quot;immutable lists&quot; and move on. That misses the point.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          Immutability is not a restriction. It is a design signal. A tuple says:
          this structure is fixed, every position has meaning, and nothing should
          change it. This article covers everything from the single-element comma gotcha
          to named tuples, hashability, and the patterns that show up in production code daily.
        </p>
      </section>

      <CreatingTuplesSection />
      <UnpackingSection />
      <ImmutabilitySection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <NamedTupleSection />
      <HashabilitySection />
      <WhenToUseSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔒",
              label: "The comma makes the tuple",
              desc: "Parentheses are optional. (42) is an int. (42,) is a tuple. The comma is the syntax.",
            },
            {
              icon: "📦",
              label: "Unpack everywhere",
              desc: "x, y = point is cleaner than x = point[0]; y = point[1]. Use * to collect remainders and _ to ignore values.",
            },
            {
              icon: "🏷️",
              label: "Named tuples for records",
              desc: "typing.NamedTuple gives field names with zero memory overhead. Use _replace() to produce updated copies.",
            },
            {
              icon: "🔑",
              label: "Tuples are hashable",
              desc: "Use tuples as dict keys or set members when you need a fixed-size composite key. Lists cannot do this.",
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
