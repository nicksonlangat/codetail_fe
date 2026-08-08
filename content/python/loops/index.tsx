import { ForLoopsSection } from "./ForLoopsSection";
import { WhileLoopsSection } from "./WhileLoopsSection";
import { EnumerateZipSection } from "./EnumerateZipSection";
import { ComprehensionsSection } from "./ComprehensionsSection";
import { GeneratorsSection } from "./GeneratorsSection";
import { PatternsSection } from "./PatternsSection";

export const toc = [
  { id: "for-loops", title: "For loops" },
  { id: "while-loops", title: "While loops" },
  { id: "enumerate-zip", title: "enumerate and zip" },
  { id: "comprehensions", title: "Comprehensions" },
  { id: "generators", title: "Generators" },
  { id: "patterns", title: "Loop patterns" },
];

export default function LoopsArticle() {
  return (
    <>
      <ForLoopsSection />
      <WhileLoopsSection />
      <EnumerateZipSection />
      <ComprehensionsSection />
      <GeneratorsSection />
      <PatternsSection />
    </>
  );
}
