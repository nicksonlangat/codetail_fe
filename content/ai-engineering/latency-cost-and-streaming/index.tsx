import { StreamingSection } from "./StreamingSection";
import { PromptCachingSection } from "./PromptCachingSection";
import { ModelCascadesSection } from "./ModelCascadesSection";
import { MeasuringWhatMattersSection } from "./MeasuringWhatMattersSection";

export const toc = [
  { id: "streaming-responses", title: "The tokens exist one at a time, so the user can see them one at a time" },
  { id: "prompt-caching", title: "Paying full price to reprocess the same system prompt on every call is a choice" },
  { id: "model-cascades-and-routing", title: "Most requests are easy. Only the hard ones need the expensive model." },
  { id: "measuring-the-right-numbers", title: "The average latency was fine. The users complaining weren't hitting the average." },
];

export default function LatencyCostAndStreamingArticle() {
  return (
    <>
      <StreamingSection />
      <PromptCachingSection />
      <ModelCascadesSection />
      <MeasuringWhatMattersSection />
    </>
  );
}
