import { CollectionsSection } from "./standard-library-gems/CollectionsSection";
import { ItertoolsSection } from "./standard-library-gems/ItertoolsSection";
import { DatetimeSection } from "./standard-library-gems/DatetimeSection";
import { JsonSection } from "./standard-library-gems/JsonSection";
import { FunctoolsSection } from "./standard-library-gems/FunctoolsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "collections",  title: "collections" },
  { id: "itertools",    title: "itertools" },
  { id: "datetime",     title: "datetime" },
  { id: "json",         title: "json" },
  { id: "functools",    title: "functools" },
  { id: "summary",      title: "Summary" },
];

export default function StandardLibraryGemsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Python ships with over 200 modules in its standard library. Most developers
          reach for{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">os</code>,{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">sys</code>,
          and{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">json</code>,
          then write everything else by hand. That is a waste — the standard library
          already solved most of it.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers five modules that replace entire categories of
          boilerplate:{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">collections</code>,{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">itertools</code>,{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">datetime</code>,{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">json</code>,
          and{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">functools</code>.
          Each one is production-grade, zero-dependency, and already on your machine.
        </p>
      </section>

      <CollectionsSection />
      <ItertoolsSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <DatetimeSection />
      <JsonSection />
      <FunctoolsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "📊",
              label: "Counter and defaultdict",
              desc: "Counter counts frequencies. defaultdict eliminates missing-key boilerplate. Both turn 5 lines of setup into one.",
            },
            {
              icon: "🔗",
              label: "itertools operates lazily",
              desc: "chain, islice, product, and groupby work on iterators and never build the full result in memory — they scale to any input size.",
            },
            {
              icon: "🕐",
              label: "Store datetimes in UTC",
              desc: "Use datetime.now(timezone.utc) for storage and APIs. Convert to local time only when displaying to the user.",
            },
            {
              icon: "⚡",
              label: "@lru_cache for pure functions",
              desc: "One decorator replaces a manual dict-based cache. Arguments must be hashable. Use @cache for an unbounded version.",
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
