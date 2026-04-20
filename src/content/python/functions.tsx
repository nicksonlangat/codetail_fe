import { DefiningFunctionsSection } from "./functions/DefiningFunctionsSection";
import { ParametersSection } from "./functions/ParametersSection";
import { ScopeSection } from "./functions/ScopeSection";
import { ClosuresSection } from "./functions/ClosuresSection";
import { DecoratorsSection } from "./functions/DecoratorsSection";
import { LambdaSection } from "./functions/LambdaSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "defining",     title: "Defining functions" },
  { id: "parameters",   title: "Parameters" },
  { id: "scope",        title: "Scope" },
  { id: "closures",     title: "Closures" },
  { id: "decorators",   title: "Decorators" },
  { id: "lambda",       title: "Lambda and higher-order" },
  { id: "summary",      title: "Summary" },
];

export default function FunctionsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Functions are the primary unit of abstraction in Python. Understand them
          deeply and you understand most of what makes Python code clean — or messy.
          This article goes from the basics all the way to decorators and closures,
          the features that separate intermediate Python from fluent Python.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          Every topic here appears in production code. Parameters, scope rules, closures,
          and decorators are not advanced concepts you can defer — they come up in
          any real codebase within the first week.
        </p>
      </section>

      <DefiningFunctionsSection />
      <ParametersSection />
      <ScopeSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <ClosuresSection />
      <DecoratorsSection />
      <LambdaSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "⚡",
              label: "Guard clauses over nesting",
              desc: "Return early on invalid conditions. Flat code is easier to read than code nested three levels deep.",
            },
            {
              icon: "🧩",
              label: "Never use mutable defaults",
              desc: "def f(items=[]) shares one list across all calls. Use def f(items=None) and assign the default inside the body.",
            },
            {
              icon: "🔒",
              label: "Closures capture by reference",
              desc: "Inside a loop, all lambdas share the same variable. Use a default argument (lambda i=i: i) or a factory function to capture by value.",
            },
            {
              icon: "🎯",
              label: "@wraps in every decorator",
              desc: "Without @wraps, decorated functions lose their __name__ and __doc__. Always include it when writing a decorator.",
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
