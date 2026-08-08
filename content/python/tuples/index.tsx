import { CreatingTuplesSection } from "./CreatingTuplesSection";
import { ImmutabilitySection } from "./ImmutabilitySection";
import { UnpackingSection } from "./UnpackingSection";
import { NamedTupleSection } from "./NamedTupleSection";
import { HashabilitySection } from "./HashabilitySection";
import { WhenToUseSection } from "./WhenToUseSection";

export const toc = [
  { id: "creating-tuples", title: "Creating tuples" },
  { id: "immutability", title: "Immutability" },
  { id: "unpacking", title: "Packing and unpacking" },
  { id: "named-tuples", title: "Named tuples" },
  { id: "hashability", title: "Hashability" },
  { id: "when-to-use", title: "Tuples vs lists" },
];

export default function TuplesArticle() {
  return (
    <>
      <CreatingTuplesSection />
      <ImmutabilitySection />
      <UnpackingSection />
      <NamedTupleSection />
      <HashabilitySection />
      <WhenToUseSection />
    </>
  );
}
