import { WhyJSONIsHardSection } from "./WhyJSONIsHardSection";
import { JSONModeSection } from "./JSONModeSection";
import { ToolCallingSection } from "./ToolCallingSection";
import { TheTrustBoundarySection } from "./TheTrustBoundarySection";

export const toc = [
  { id: "why-getting-json-out-is-hard", title: "Asking nicely for JSON isn't the same as requiring it" },
  { id: "json-mode-and-schema-validation", title: "JSON mode fixes syntax. It doesn't fix shape." },
  { id: "tool-calling-is-the-same-mechanism", title: "Tool calling is the same mechanism, aimed at a decision instead of a blob" },
  { id: "why-this-is-the-real-api-surface", title: "The model decides. Your code still has to check." },
];

export default function StructuredOutputAndToolCallingArticle() {
  return (
    <>
      <WhyJSONIsHardSection />
      <JSONModeSection />
      <ToolCallingSection />
      <TheTrustBoundarySection />
    </>
  );
}
