import { CreatingDictsSection } from "./CreatingDictsSection";
import { AccessingSection } from "./AccessingSection";
import { ModifyingSection } from "./ModifyingSection";
import { IteratingSection } from "./IteratingSection";
import { ComprehensionsSection } from "./ComprehensionsSection";
import { DefaultDictSection } from "./DefaultDictSection";
import { PatternsSection } from "./PatternsSection";

export const toc = [
  { id: "creating-dicts", title: "Creating dictionaries" },
  { id: "accessing", title: "Accessing values" },
  { id: "modifying", title: "Modifying dictionaries" },
  { id: "iterating", title: "Iterating" },
  { id: "comprehensions", title: "Dict comprehensions" },
  { id: "defaultdict", title: "defaultdict and Counter" },
  { id: "patterns", title: "Real-world patterns" },
];

export default function DictionariesArticle() {
  return (
    <>
      <CreatingDictsSection />
      <AccessingSection />
      <ModifyingSection />
      <IteratingSection />
      <ComprehensionsSection />
      <DefaultDictSection />
      <PatternsSection />
    </>
  );
}
