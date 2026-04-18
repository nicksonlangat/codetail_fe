import { WhatIsAVariableSection } from "./variables-and-types/WhatIsAVariableSection";
import { EverythingIsAnObjectSection } from "./variables-and-types/EverythingIsAnObjectSection";
import { BuiltInTypesSection } from "./variables-and-types/BuiltInTypesSection";
import { DynamicTypingSection } from "./variables-and-types/DynamicTypingSection";
import { TypeConversionSection } from "./variables-and-types/TypeConversionSection";
import { AssignmentPatternsSection } from "./variables-and-types/AssignmentPatternsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "names-not-boxes", title: "Names, not boxes" },
  { id: "everything-is-an-object", title: "Everything is an object" },
  { id: "built-in-types", title: "The built-in types" },
  { id: "dynamic-typing", title: "Dynamic typing" },
  { id: "type-conversion", title: "Checking & converting types" },
  { id: "assignment-patterns", title: "Assignment patterns" },
  { id: "summary", title: "Summary" },
];

export default function VariablesAndTypesArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Variables are the first thing you write in Python and the thing most tutorials explain
          the least. The usual explanation — "a variable is a box that stores a value" — is
          wrong enough to cause real confusion later.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article builds the correct mental model: what a variable actually is, why
          everything in Python is an object, how types work, and the assignment patterns you&apos;ll
          use daily. Get this right and most Python surprises stop being surprising.
        </p>
      </section>

      <WhatIsAVariableSection />
      <EverythingIsAnObjectSection />
      <BuiltInTypesSection />
      <DynamicTypingSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <TypeConversionSection />
      <AssignmentPatternsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🏷️",
              label: "Names, not boxes",
              desc: "A variable is a name bound to an object. Assignment moves the label, it doesn't copy the value.",
            },
            {
              icon: "🔍",
              label: "Every object has three things",
              desc: "Identity (id()), type (type()), and value. Use == for value comparison, is only for identity.",
            },
            {
              icon: "🔄",
              label: "Types live on objects",
              desc: "Python is dynamically typed. The type belongs to the object, not the variable. A name can point to any type.",
            },
            {
              icon: "⚠️",
              label: "Explicit conversion only",
              desc: "Python won't silently coerce types. int(3.9) truncates. bool('False') is True. Always convert intentionally.",
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
