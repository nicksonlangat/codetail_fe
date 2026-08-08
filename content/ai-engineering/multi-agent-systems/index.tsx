import { WhyNotJustOneAgentSection } from "./WhyNotJustOneAgentSection";
import { OrchestratorWorkerSection } from "./OrchestratorWorkerSection";
import { HandoffsAndSharedStateSection } from "./HandoffsAndSharedStateSection";
import { WhenNotToSection } from "./WhenNotToSection";

export const toc = [
  { id: "why-not-just-one-bigger-agent", title: "Every extra agent is a coordination problem a single one doesn't have" },
  { id: "orchestrator-worker-pattern", title: "One orchestrator, several narrow specialists" },
  { id: "handoffs-and-shared-state", title: "What crosses the boundary between two agents matters more than the boundary itself" },
  { id: "when-multi-agent-is-the-wrong-call", title: "Signs it's time to collapse back down to one" },
];

export default function MultiAgentSystemsArticle() {
  return (
    <>
      <WhyNotJustOneAgentSection />
      <OrchestratorWorkerSection />
      <HandoffsAndSharedStateSection />
      <WhenNotToSection />
    </>
  );
}
