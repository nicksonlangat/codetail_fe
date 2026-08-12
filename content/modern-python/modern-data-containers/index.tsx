import { DataclassBasicsSection } from "./DataclassBasicsSection";
import { DataclassOptionsSection } from "./DataclassOptionsSection";
import { TypedDictSection } from "./TypedDictSection";
import { WhenToUseWhichSection } from "./WhenToUseWhichSection";

export const toc = [
  { id: "dataclass-basics", title: "The boilerplate tax" },
  { id: "dataclass-options", title: "slots, order, field(), __post_init__" },
  { id: "typeddict", title: "TypedDict" },
  { id: "when-to-use-which", title: "dict vs TypedDict vs NamedTuple vs dataclass" },
];

export default function ModernDataContainersArticle() {
  return (
    <>
      <DataclassBasicsSection />
      <DataclassOptionsSection />
      <TypedDictSection />
      <WhenToUseWhichSection />
    </>
  );
}
