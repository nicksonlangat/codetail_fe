import { ContextRotSection } from "./ContextRotSection";
import { WhatBelongsSection } from "./WhatBelongsSection";
import { PromptAssemblySection } from "./PromptAssemblySection";
import { WhatToCutSection } from "./WhatToCutSection";

export const toc = [
  { id: "context-rot", title: "A bigger window doesn't mean every token in it gets equal attention" },
  { id: "what-actually-belongs-in-the-window", title: "Paste the relevant ten lines, not the file they live in" },
  { id: "prompt-assembly-as-a-pipeline", title: "The final prompt is assembled, not typed" },
  { id: "deciding-what-to-cut-first", title: "When the budget doesn't fit everything, something has to lose first" },
];

export default function ContextEngineeringArticle() {
  return (
    <>
      <ContextRotSection />
      <WhatBelongsSection />
      <PromptAssemblySection />
      <WhatToCutSection />
    </>
  );
}
