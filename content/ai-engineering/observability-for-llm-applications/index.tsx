import { TracingTheAgentLoopSection } from "./TracingTheAgentLoopSection";
import { LoggingPromptsSafelySection } from "./LoggingPromptsSafelySection";
import { DebuggingNonDeterminismSection } from "./DebuggingNonDeterminismSection";
import { AlertingForAISpecificFailuresSection } from "./AlertingForAISpecificFailuresSection";

export const toc = [
  { id: "tracing-a-request-through-an-agent-loop", title: "The final answer being wrong tells you nothing about which step broke" },
  { id: "logging-prompts-and-completions-safely", title: "A trace is a second copy of everything the model ever saw" },
  { id: "debugging-something-that-wont-reproduce", title: "\"I can't reproduce it\" doesn't mean it didn't happen" },
  { id: "alerting-for-ai-specific-failures", title: "A generic error rate misses most of what actually goes wrong here" },
];

export default function ObservabilityForLLMApplicationsArticle() {
  return (
    <>
      <TracingTheAgentLoopSection />
      <LoggingPromptsSafelySection />
      <DebuggingNonDeterminismSection />
      <AlertingForAISpecificFailuresSection />
    </>
  );
}
