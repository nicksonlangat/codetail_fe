import { CreatingListsSection } from "./CreatingListsSection";
import { AccessingListsSection } from "./AccessingListsSection";
import { ModifyingListsSection } from "./ModifyingListsSection";
import { ComprehensionsSection } from "./ComprehensionsSection";
import { SortingSection } from "./SortingSection";
import { MapSection } from "./MapSection";
import { FilterSection } from "./FilterSection";
import { PatternsSection } from "./PatternsSection";

export const toc = [
  { id: "creating-lists", title: "Creating lists" },
  { id: "accessing-lists", title: "Indexing and slicing" },
  { id: "modifying-lists", title: "Modifying lists" },
  { id: "comprehensions", title: "List comprehensions" },
  { id: "sorting", title: "Sorting" },
  { id: "map", title: "Transforming lists" },
  { id: "filter", title: "Filtering lists" },
  { id: "real-world-patterns", title: "Real-world patterns" },
];

export default function ListsArticle() {
  return (
    <>
      <CreatingListsSection />
      <AccessingListsSection />
      <ModifyingListsSection />
      <ComprehensionsSection />
      <SortingSection />
      <MapSection />
      <FilterSection />
      <PatternsSection />
    </>
  );
}
