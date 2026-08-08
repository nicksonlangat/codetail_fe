import { PromptInjectionSection } from "./PromptInjectionSection";
import { JailbreaksSection } from "./JailbreaksSection";
import { OutputFilteringSection } from "./OutputFilteringSection";
import { DefenseInDepthForAgentsSection } from "./DefenseInDepthForAgentsSection";

export const toc = [
  { id: "prompt-injection", title: "Every piece of text the model reads is a place instructions can hide" },
  { id: "jailbreaks", title: "A jailbreak comes from the user asking directly, not content hiding a command" },
  { id: "output-filtering", title: "A check on the way out catches what a check on the way in can't" },
  { id: "defense-in-depth-for-agents", title: "No single layer here is the fix, the same as everywhere else in this series" },
];

export default function GuardrailsSafetyAndPromptInjectionArticle() {
  return (
    <>
      <PromptInjectionSection />
      <JailbreaksSection />
      <OutputFilteringSection />
      <DefenseInDepthForAgentsSection />
    </>
  );
}
