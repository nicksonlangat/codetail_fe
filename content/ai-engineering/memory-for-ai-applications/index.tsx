import { ShortTermVsLongTermSection } from "./ShortTermVsLongTermSection";
import { SummarizationSection } from "./SummarizationSection";
import { WhatToPersistSection } from "./WhatToPersistSection";
import { RetrievingMemoryAtRuntimeSection } from "./RetrievingMemoryAtRuntimeSection";

export const toc = [
  { id: "short-term-context-vs-long-term-memory", title: "The message list is not memory, it's the current conversation" },
  { id: "summarization-as-compression", title: "Summarizing the oldest turns instead of dropping or keeping them whole" },
  { id: "deciding-what-to-persist", title: "Not everything a user says is meant to outlive the conversation" },
  { id: "retrieving-memory-at-runtime", title: "Pulling in the right memories is context engineering all over again" },
];

export default function MemoryForAIApplicationsArticle() {
  return (
    <>
      <ShortTermVsLongTermSection />
      <SummarizationSection />
      <WhatToPersistSection />
      <RetrievingMemoryAtRuntimeSection />
    </>
  );
}
