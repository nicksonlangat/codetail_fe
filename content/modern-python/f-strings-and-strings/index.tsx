import { FstringEvolutionSection } from "./FstringEvolutionSection";
import { RemovePrefixSuffixSection } from "./RemovePrefixSuffixSection";
import { NumberFormattingSection } from "./NumberFormattingSection";
import { MultilineFstringsSection } from "./MultilineFstringsSection";

export const toc = [
  { id: "fstring-evolution", title: 'f-string evolution: from % to {x=}' },
  { id: "remove-prefix-suffix", title: "removeprefix and removesuffix" },
  { id: "number-formatting", title: "Number formatting" },
  { id: "multiline-fstrings", title: "Multiline f-strings and nested quotes" },
];

export default function FstringsAndStringsArticle() {
  return (
    <>
      <FstringEvolutionSection />
      <RemovePrefixSuffixSection />
      <NumberFormattingSection />
      <MultilineFstringsSection />
    </>
  );
}
