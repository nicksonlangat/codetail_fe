import { TheDecisionFrameworkSection } from "./TheDecisionFrameworkSection";
import { WhatFineTuningActuallyChangesSection } from "./WhatFineTuningActuallyChangesSection";
import { LoRASection } from "./LoRASection";
import { WhenBetterPromptingWinsSection } from "./WhenBetterPromptingWinsSection";

export const toc = [
  { id: "the-decision-framework", title: "Three tools for three different problems, not three tiers of the same one" },
  { id: "what-fine-tuning-actually-changes", title: "Fine-tuning teaches a pattern of behavior, not a fact" },
  { id: "lora-and-instruction-tuning-practically", title: "What most people mean by \"we fine-tuned a model\"" },
  { id: "when-better-prompting-wins-outright", title: "The honest cost comparison almost always favors prompting first" },
];

export default function FineTuningVsPromptingVsRAGArticle() {
  return (
    <>
      <TheDecisionFrameworkSection />
      <WhatFineTuningActuallyChangesSection />
      <LoRASection />
      <WhenBetterPromptingWinsSection />
    </>
  );
}
