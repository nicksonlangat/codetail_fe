import { TheNeedSection } from "./TheNeedSection";
import { ABCSection } from "./ABCSection";
import { ProtocolSection } from "./ProtocolSection";
import { WhenToUseSection } from "./WhenToUseSection";

export const toc = [
  { id: "the-need", title: "Duck typing works, until it doesn't" },
  { id: "abc", title: "ABC and @abstractmethod" },
  { id: "protocol", title: "Protocol: structural subtyping" },
  { id: "when-to-use", title: "ABC vs Protocol: when to use which" },
];

export default function AbstractionWithABCsArticle() {
  return (
    <>
      <TheNeedSection />
      <ABCSection />
      <ProtocolSection />
      <WhenToUseSection />
    </>
  );
}
