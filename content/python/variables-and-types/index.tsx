import { WhatIsAVariableSection } from "./WhatIsAVariableSection";
import { BuiltInTypesSection } from "./BuiltInTypesSection";
import { DynamicTypingSection } from "./DynamicTypingSection";
import { EverythingIsAnObjectSection } from "./EverythingIsAnObjectSection";
import { TypeConversionSection } from "./TypeConversionSection";
import { AssignmentPatternsSection } from "./AssignmentPatternsSection";

export const toc = [
  { id: "names-not-boxes", title: "Names, not boxes" },
  { id: "built-in-types", title: "The five fundamental types" },
  { id: "dynamic-typing", title: "Dynamic typing" },
  { id: "everything-is-an-object", title: "Everything is an object" },
  { id: "type-conversion", title: "Checking and converting types" },
  { id: "assignment-patterns", title: "Assignment patterns" },
];

export default function VariablesAndTypesArticle() {
  return (
    <>
      <WhatIsAVariableSection />
      <BuiltInTypesSection />
      <DynamicTypingSection />
      <EverythingIsAnObjectSection />
      <TypeConversionSection />
      <AssignmentPatternsSection />
    </>
  );
}
