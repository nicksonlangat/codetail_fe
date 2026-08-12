import { WhatPolymorphismSection } from "./WhatPolymorphismSection";
import { DuckTypingSection } from "./DuckTypingSection";
import { MethodOverridingSection } from "./MethodOverridingSection";
import { IsinstanceSmellSection } from "./IsinstanceSmellSection";

export const toc = [
  { id: "what-polymorphism", title: "Same call, different behavior" },
  { id: "duck-typing", title: "Duck typing: Python's approach" },
  { id: "method-overriding", title: "Method overriding" },
  { id: "isinstance-smell", title: "isinstance checks are a warning sign" },
];

export default function PolymorphismAndDuckTypingArticle() {
  return (
    <>
      <WhatPolymorphismSection />
      <DuckTypingSection />
      <MethodOverridingSection />
      <IsinstanceSmellSection />
    </>
  );
}
