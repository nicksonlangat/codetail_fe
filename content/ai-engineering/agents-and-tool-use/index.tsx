import { TheLoopSection } from "./TheLoopSection";
import { WhyAgentsFailSilentlySection } from "./WhyAgentsFailSilentlySection";
import { WhatAgenticActuallyBuysSection } from "./WhatAgenticActuallyBuysSection";
import { BoundingTheLoopSection } from "./BoundingTheLoopSection";

export const toc = [
  { id: "the-plan-call-observe-loop", title: "An agent is the tool-calling loop from three articles ago, repeated" },
  { id: "why-agents-fail-silently", title: "A wrong turn doesn't throw an exception" },
  { id: "what-agentic-actually-buys-you", title: "The loop is worth it when you can't predict the steps ahead of time" },
  { id: "bounding-the-loop", title: "Every loop needs a way to stop that isn't \"trust the model to know when\"" },
];

export default function AgentsAndToolUseArticle() {
  return (
    <>
      <TheLoopSection />
      <WhyAgentsFailSilentlySection />
      <WhatAgenticActuallyBuysSection />
      <BoundingTheLoopSection />
    </>
  );
}
