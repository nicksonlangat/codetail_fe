import { OpenReadSection } from "./file-io/OpenReadSection";
import { WriteSection } from "./file-io/WriteSection";
import { PathlibSection } from "./file-io/PathlibSection";
import { CSVSection } from "./file-io/CSVSection";
import { JSONSection } from "./file-io/JSONSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "open-read",    title: "Opening and reading" },
  { id: "writing",      title: "Writing files" },
  { id: "pathlib",      title: "pathlib" },
  { id: "csv",          title: "CSV files" },
  { id: "json",         title: "JSON files" },
  { id: "summary",      title: "Summary" },
];

export default function FileIOArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Almost every real program reads or writes files. Configuration files,
          data imports, logs, exports — file I/O is unavoidable. Python makes it
          straightforward, but there are a handful of details that trip people up:
          forgetting to close files, ignoring encoding, splitting CSV lines manually.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers text and binary files, every open mode, pathlib for
          path manipulation, and the standard library&apos;s CSV and JSON modules.
        </p>
      </section>

      <OpenReadSection />
      <WriteSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <PathlibSection />
      <CSVSection />
      <JSONSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🔒",
              label: "Always use with",
              desc: "with open(...) as f guarantees the file is closed even when exceptions occur. Never call .close() manually.",
            },
            {
              icon: "🌐",
              label: "Specify encoding",
              desc: "Always pass encoding='utf-8'. The default depends on the OS and silently corrupts non-ASCII characters on Windows.",
            },
            {
              icon: "📁",
              label: "pathlib over os.path",
              desc: "Path objects compose with /, have .read_text() and .write_text(), and work identically on all platforms.",
            },
            {
              icon: "📋",
              label: "csv module for CSV",
              desc: "csv.DictReader gives you rows as dicts. csv.writer handles quoting correctly. Never split on commas manually.",
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
