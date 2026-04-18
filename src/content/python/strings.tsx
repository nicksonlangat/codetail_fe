import { FoundationsSection } from "./strings/FoundationsSection";
import { CreationSection } from "./strings/CreationSection";
import { SlicingSection } from "./strings/SlicingSection";
import { MethodsSection } from "./strings/MethodsSection";
import { PerformanceSection } from "./strings/PerformanceSection";
import { PatternsSection } from "./strings/PatternsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-is-a-string", title: "What is a string?" },
  { id: "creating-strings", title: "Creating strings" },
  { id: "indexing-slicing", title: "Indexing & slicing" },
  { id: "string-methods", title: "String methods" },
  { id: "performance", title: "Performance" },
  { id: "real-world-patterns", title: "Real-world patterns" },
  { id: "summary", title: "Summary" },
];

export default function StringsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Strings are everywhere in Python: user input, file contents, API responses, log
          messages, configuration values. You&apos;ll write string operations thousands of times.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers everything: how strings work under the hood, every slice pattern,
          every method worth knowing, the performance trap that trips everyone, and the
          real-world patterns you&apos;ll use daily. By the end you&apos;ll have a complete
          mental model, not just what works but <em>why</em> it works.
        </p>
      </section>

      <FoundationsSection />
      <CreationSection />
      <SlicingSection />
      <MethodsSection />
      <PerformanceSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <PatternsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔒",
              label: "Immutable",
              desc: "Strings can't be changed in place. Every operation returns a new string object.",
            },
            {
              icon: "📍",
              label: "Indexed from both ends",
              desc: "s[0] is the first character, s[-1] is always the last. Both work in slices.",
            },
            {
              icon: "✂️",
              label: "Sliceable",
              desc: "[start:stop:step] extracts any subsequence. s[::-1] reverses in one expression.",
            },
            {
              icon: "⚡",
              label: "join(), not +=",
              desc: 'Build strings from parts with "".join(list). Never concatenate in a loop.',
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
