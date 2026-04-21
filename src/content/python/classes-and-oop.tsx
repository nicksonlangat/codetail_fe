import { ClassBasicsSection } from "./classes-and-oop/ClassBasicsSection";
import { DunderSection } from "./classes-and-oop/DunderSection";
import { PropertiesSection } from "./classes-and-oop/PropertiesSection";
import { InheritanceSection } from "./classes-and-oop/InheritanceSection";
import { WhenToUseSection } from "./classes-and-oop/WhenToUseSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "class-basics", title: "Class basics" },
  { id: "dunder",       title: "Dunder methods" },
  { id: "properties",   title: "Properties" },
  { id: "inheritance",  title: "Inheritance" },
  { id: "when-to-use",  title: "When to use classes" },
  { id: "summary",      title: "Summary" },
];

export default function ClassesOOPArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          A class is a way to package mutable state and the code that operates
          on it. Python&apos;s class system is pragmatic: no access modifiers, no
          interfaces, no obligatory hierarchy.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__init__</code>,
          instance attributes, dunder methods, properties, inheritance with{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">super()</code>,
          and honest guidance on when a class is the right tool.
        </p>
      </section>

      <ClassBasicsSection />
      <DunderSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <PropertiesSection />
      <InheritanceSection />
      <WhenToUseSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🏗️",
              label: "__init__ sets instance state",
              desc: "self.x = x stores data on the instance. Every attribute you read must be set in __init__ or another method before it is used.",
            },
            {
              icon: "🔧",
              label: "Always write __repr__",
              desc: "__repr__ shows up in the REPL, error messages, and container reprs. __str__ is optional and falls back to __repr__ when absent.",
            },
            {
              icon: "🔒",
              label: "@property for validation",
              desc: "Start with a plain attribute. Add @property only when you need to enforce a constraint or compute a derived value on read.",
            },
            {
              icon: "🧬",
              label: "Prefer composition to deep inheritance",
              desc: "Deep hierarchies are hard to change. If you are inheriting just to share code, pass an object instead.",
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
