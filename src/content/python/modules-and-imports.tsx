import { WhatIsAModuleSection } from "./modules-and-imports/WhatIsAModuleSection";
import { ImportSyntaxSection } from "./modules-and-imports/ImportSyntaxSection";
import { PackagesSection } from "./modules-and-imports/PackagesSection";
import { SysPathSection } from "./modules-and-imports/SysPathSection";
import { RelativeImportsSection } from "./modules-and-imports/RelativeImportsSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction",     title: "Introduction" },
  { id: "what-is-a-module", title: "What is a module?" },
  { id: "import-syntax",    title: "Import syntax" },
  { id: "packages",         title: "Packages" },
  { id: "sys-path",         title: "How Python finds modules" },
  { id: "relative-imports", title: "Relative imports" },
  { id: "summary",          title: "Summary" },
];

export default function ModulesAndImportsArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Every Python project beyond a single file needs imports. Most developers
          learn just enough to get past{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">ModuleNotFoundError</code>{" "}
          and move on. That leaves gaps: confused about packages versus modules,
          unsure when to use relative imports, puzzled by circular import errors.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers how the import system actually works, every import
          syntax form, packages and{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__init__.py</code>,
          how Python finds code on disk, and how to structure projects that stay
          clean as they grow.
        </p>
      </section>

      <WhatIsAModuleSection />
      <ImportSyntaxSection />
      <PackagesSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <SysPathSection />
      <RelativeImportsSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "📄",
              label: "Any .py file is a module",
              desc: "Save a .py file, import it by name. Python executes it once and caches the result in sys.modules — subsequent imports return the same object.",
            },
            {
              icon: "📦",
              label: "Packages are directories",
              desc: "Add __init__.py to a directory to make it a package. Use __init__.py to expose a clean public API and hide internal structure.",
            },
            {
              icon: "🔍",
              label: "Python searches sys.path",
              desc: "ModuleNotFoundError means the module is not on sys.path. Check your virtual environment and project layout before modifying sys.path directly.",
            },
            {
              icon: "➡️",
              label: "Prefer absolute imports",
              desc: "from myapp.models import User is explicit and stable. Relative imports are fine inside packages but break when files move.",
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
