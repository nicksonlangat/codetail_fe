import { RolesSection } from "./RolesSection";
import { PromptAsSpecSection } from "./PromptAsSpecSection";
import { FewShotSection } from "./FewShotSection";
import { IterationAsEngineeringSection } from "./IterationAsEngineeringSection";

export const toc = [
  { id: "system-user-assistant-roles", title: "The role isn't decorative" },
  { id: "a-prompt-is-a-spec", title: "A prompt is a spec, and inconsistent output usually means an incomplete one" },
  { id: "few-shot-examples", title: "Some things are easier to demonstrate than describe" },
  { id: "prompting-is-iterative-engineering", title: "A prompt change is a code change" },
];

export default function PromptingAsInterfaceDesignArticle() {
  return (
    <>
      <RolesSection />
      <PromptAsSpecSection />
      <FewShotSection />
      <IterationAsEngineeringSection />
    </>
  );
}
