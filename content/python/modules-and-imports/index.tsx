import { WhatIsAModuleSection } from "./WhatIsAModuleSection";
import { ImportSyntaxSection } from "./ImportSyntaxSection";
import { PackagesSection } from "./PackagesSection";
import { RelativeImportsSection } from "./RelativeImportsSection";
import { SysPathSection } from "./SysPathSection";

export const toc = [
  { id: "what-is-a-module", title: "What is a module?" },
  { id: "import-syntax", title: "Import syntax" },
  { id: "packages", title: "Packages" },
  { id: "relative-imports", title: "Relative imports" },
  { id: "sys-path", title: "How Python finds modules" },
];

export default function ModulesAndImportsArticle() {
  return (
    <>
      <WhatIsAModuleSection />
      <ImportSyntaxSection />
      <PackagesSection />
      <RelativeImportsSection />
      <SysPathSection />
    </>
  );
}
