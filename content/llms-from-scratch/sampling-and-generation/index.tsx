import { DecodingProblemSection } from "./DecodingProblemSection";
import { TemperatureSection } from "./TemperatureSection";
import { TopKTopPSection } from "./TopKTopPSection";
import { GreedyBeamSearchSection } from "./GreedyBeamSearchSection";

export const toc = [
  { id: "the-decoding-problem", title: "From probability distribution to one word: the decoding problem" },
  { id: "temperature", title: "Temperature: turning the randomness dial" },
  { id: "top-k-and-top-p", title: "Top-k and top-p (nucleus) sampling: cutting off the long tail" },
  { id: "greedy-beam-search", title: "Greedy decoding, beam search, and why chatbots use neither" },
];

export default function SamplingAndGenerationArticle() {
  return (
    <>
      <DecodingProblemSection />
      <TemperatureSection />
      <TopKTopPSection />
      <GreedyBeamSearchSection />
    </>
  );
}
