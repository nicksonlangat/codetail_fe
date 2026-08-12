import { TheBlueprintSection } from "./TheBlueprintSection";
import { InitAndSelfSection } from "./InitAndSelfSection";
import { AttributesSection } from "./AttributesSection";
import { CommonMistakesSection } from "./CommonMistakesSection";

export const toc = [
  { id: "the-blueprint", title: "The class is a blueprint" },
  { id: "init-and-self", title: "__init__ and self" },
  { id: "attributes", title: "Instance vs class attributes" },
  { id: "common-mistakes", title: "The four mistakes everyone makes" },
];

export default function YourFirstClassArticle() {
  return (
    <>
      <TheBlueprintSection />
      <InitAndSelfSection />
      <AttributesSection />
      <CommonMistakesSection />
    </>
  );
}
