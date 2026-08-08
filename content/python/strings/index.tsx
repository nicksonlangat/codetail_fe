import { FoundationsSection } from "./FoundationsSection";
import { CreationSection } from "./CreationSection";
import { SlicingSection } from "./SlicingSection";
import { MethodsSection } from "./MethodsSection";
import { PatternsSection } from "./PatternsSection";
import { PerformanceSection } from "./PerformanceSection";

export const toc = [
  { id: "what-is-a-string", title: "What is a string?" },
  { id: "creating-strings", title: "Creating strings" },
  { id: "indexing-slicing", title: "Indexing & slicing" },
  { id: "string-methods", title: "String methods" },
  { id: "real-world-patterns", title: "Real-world patterns" },
  { id: "performance", title: "Performance" },
];

export default function StringsArticle() {
  return (
    <>
      <FoundationsSection />
      <CreationSection />
      <SlicingSection />
      <MethodsSection />
      <PatternsSection />
      <PerformanceSection />
    </>
  );
}
