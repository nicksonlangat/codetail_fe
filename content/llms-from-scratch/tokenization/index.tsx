import { TextToNumbersSection } from "./TextToNumbersSection";
import { ByteFairEncodingSection } from "./ByteFairEncodingSection";
import { TokenizerPlaygroundSection } from "./TokenizerPlaygroundSection";
import { TokenizationQuirksSection } from "./TokenizationQuirksSection";

export const toc = [
  { id: "text-to-numbers", title: "Why raw text can't be fed to a neural network" },
  { id: "byte-pair-encoding", title: "Byte-pair encoding: building a vocabulary" },
  { id: "tokenizer-playground", title: "Watching the merges happen" },
  { id: "tokenization-quirks", title: "What tokenization quietly explains" },
];

export default function TokenizationArticle() {
  return (
    <>
      <TextToNumbersSection />
      <ByteFairEncodingSection />
      <TokenizerPlaygroundSection />
      <TokenizationQuirksSection />
    </>
  );
}
