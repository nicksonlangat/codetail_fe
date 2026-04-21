import { TryExceptSection } from "./error-handling/TryExceptSection";
import { ExceptionHierarchySection } from "./error-handling/ExceptionHierarchySection";
import { RaiseSection } from "./error-handling/RaiseSection";
import { ContextManagersSection } from "./error-handling/ContextManagersSection";
import { PatternsSection } from "./error-handling/PatternsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction",     title: "Introduction" },
  { id: "try-except",       title: "try / except" },
  { id: "hierarchy",        title: "Exception hierarchy" },
  { id: "raise",            title: "Raising exceptions" },
  { id: "context-managers", title: "Context managers" },
  { id: "patterns",         title: "Patterns" },
  { id: "summary",          title: "Summary" },
];

export default function ErrorHandlingArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Errors are not edge cases. Networks fail, files disappear, users send
          unexpected input. The question is not whether your code will encounter
          errors — it is whether it handles them gracefully or crashes.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers the full Python error handling toolkit: try/except
          with all its clauses, the exception hierarchy, raising and chaining exceptions,
          custom exception types, context managers, and the patterns that separate
          defensive code from brittle code.
        </p>
      </section>

      <TryExceptSection />
      <ExceptionHierarchySection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <RaiseSection />
      <ContextManagersSection />
      <PatternsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🎯",
              label: "Catch specifically",
              desc: "Catch the most specific exception that fits. Avoid bare except and broad Exception catches — they hide real bugs.",
            },
            {
              icon: "🔗",
              label: "raise ... from ...",
              desc: "When translating exceptions, chain them with raise NewError from original. Callers get the high-level error; the root cause is preserved.",
            },
            {
              icon: "🔒",
              label: "with over try/finally",
              desc: "Context managers guarantee cleanup without manual finally blocks. Use @contextmanager to write your own in 5 lines.",
            },
            {
              icon: "🌊",
              label: "EAFP in Python",
              desc: "Try the operation and handle failure. This is more readable than pre-checking and avoids TOCTOU race conditions in concurrent code.",
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
