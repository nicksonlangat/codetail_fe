import { TryExceptSection } from "./TryExceptSection";
import { ExceptionHierarchySection } from "./ExceptionHierarchySection";
import { RaiseSection } from "./RaiseSection";
import { ContextManagersSection } from "./ContextManagersSection";
import { PatternsSection } from "./PatternsSection";

export const toc = [
  { id: "try-except", title: "try / except" },
  { id: "hierarchy", title: "Exception hierarchy" },
  { id: "raise", title: "Raising exceptions" },
  { id: "context-managers", title: "Context managers" },
  { id: "patterns", title: "Patterns" },
];

export default function ErrorHandlingArticle() {
  return (
    <>
      <TryExceptSection />
      <ExceptionHierarchySection />
      <RaiseSection />
      <ContextManagersSection />
      <PatternsSection />
    </>
  );
}
