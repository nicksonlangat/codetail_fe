import { PathlibSection } from "./PathlibSection";
import { ZoneinfoSection } from "./ZoneinfoSection";
import { TomllibSection } from "./TomllibSection";
import { FunctoolsModernSection } from "./FunctoolsModernSection";

export const toc = [
  { id: "pathlib", title: "pathlib: stop using os.path" },
  { id: "zoneinfo", title: "zoneinfo: timezones without pytz" },
  { id: "tomllib", title: "tomllib: built-in TOML parsing (3.11)" },
  { id: "functools-modern", title: "functools: partial, reduce, total_ordering" },
];

export default function StandardLibraryModernArticle() {
  return (
    <>
      <PathlibSection />
      <ZoneinfoSection />
      <TomllibSection />
      <FunctoolsModernSection />
    </>
  );
}
