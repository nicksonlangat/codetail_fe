import { BeforeMatchSection } from "./BeforeMatchSection";
import { MatchBasicsSection } from "./MatchBasicsSection";
import { StructuredPatternsSection } from "./StructuredPatternsSection";
import { GuardsAndRealWorldSection } from "./GuardsAndRealWorldSection";

export const toc = [
  { id: "before-match", title: "The isinstance ladder" },
  { id: "match-basics", title: "match/case basics" },
  { id: "structured-patterns", title: "Class, sequence, and mapping patterns" },
  { id: "guards-and-real-world", title: "Guards and a real-world example" },
];

export default function PatternMatchingArticle() {
  return (
    <>
      <BeforeMatchSection />
      <MatchBasicsSection />
      <StructuredPatternsSection />
      <GuardsAndRealWorldSection />
    </>
  );
}
