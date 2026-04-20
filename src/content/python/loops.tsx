import { ForLoopsSection } from "./loops/ForLoopsSection";
import { WhileLoopsSection } from "./loops/WhileLoopsSection";
import { EnumerateZipSection } from "./loops/EnumerateZipSection";
import { ComprehensionsSection } from "./loops/ComprehensionsSection";
import { GeneratorsSection } from "./loops/GeneratorsSection";
import { PatternsSection } from "./loops/PatternsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction",   title: "Introduction" },
  { id: "for-loops",      title: "For loops" },
  { id: "while-loops",    title: "While loops" },
  { id: "enumerate-zip",  title: "enumerate and zip" },
  { id: "comprehensions", title: "Comprehensions" },
  { id: "generators",     title: "Generators" },
  { id: "patterns",       title: "Loop patterns" },
  { id: "summary",        title: "Summary" },
];

export default function LoopsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Most of what programs do is iterate: over rows, over files, over API pages,
          over items in a queue. Python gives you more iteration tools than most languages
          — and most Python developers use only a fraction of them.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers every iteration pattern you will encounter in real code:
          for and while loops, enumerate and zip, all three comprehension types,
          generators and lazy evaluation, and the loop patterns that come up constantly
          in production Python.
        </p>
      </section>

      <ForLoopsSection />
      <WhileLoopsSection />
      <EnumerateZipSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <ComprehensionsSection />
      <GeneratorsSection />
      <PatternsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔄",
              label: "for over while",
              desc: "Use for when iterating a known sequence. Use while when the stopping condition depends on runtime state. for is safer — it cannot infinite-loop by accident.",
            },
            {
              icon: "🔢",
              label: "enumerate, not range(len())",
              desc: "for i, item in enumerate(items) is cleaner and cannot go out of bounds. range(len()) is the C-style pattern — avoid it in Python.",
            },
            {
              icon: "⚡",
              label: "Generators save memory",
              desc: "Replace [x for x in items] with (x for x in items) when you only need to iterate once. A generator uses constant memory regardless of size.",
            },
            {
              icon: "🎯",
              label: "next() for early exit",
              desc: "next((x for x in items if condition), default) finds the first match without scanning the rest. More expressive than a manual loop-and-break.",
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
