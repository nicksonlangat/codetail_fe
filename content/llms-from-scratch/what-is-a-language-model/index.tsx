import { LanguageModelDefinedSection } from "./LanguageModelDefinedSection";
import { AutoregressiveLoopSection } from "./AutoregressiveLoopSection";
import { WhatThisExplainsSection } from "./WhatThisExplainsSection";
import { RoadmapSection } from "./RoadmapSection";

export const toc = [
  { id: "language-model-defined", title: "What a language model actually is" },
  { id: "autoregressive-loop", title: "The distribution, the sample, the loop" },
  { id: "what-this-explains", title: "What this explains, and what it doesn't" },
  { id: "roadmap", title: "Where this series goes from here" },
];

export default function WhatIsALanguageModelArticle() {
  return (
    <>
      <LanguageModelDefinedSection />
      <AutoregressiveLoopSection />
      <WhatThisExplainsSection />
      <RoadmapSection />
    </>
  );
}
