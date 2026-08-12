import { ReprAndStrSection } from "./ReprAndStrSection";
import { EqualityAndHashingSection } from "./EqualityAndHashingSection";
import { OperatorOverloadingSection } from "./OperatorOverloadingSection";
import { ContainerProtocolSection } from "./ContainerProtocolSection";
import { ContextManagerSection } from "./ContextManagerSection";

export const toc = [
  { id: "repr-and-str", title: "__repr__ and __str__" },
  { id: "equality-and-hashing", title: "__eq__ and __hash__" },
  { id: "operator-overloading", title: "Operator overloading" },
  { id: "container-protocol", title: "The container protocol" },
  { id: "context-manager", title: "Context managers" },
];

export default function MagicMethodsArticle() {
  return (
    <>
      <ReprAndStrSection />
      <EqualityAndHashingSection />
      <OperatorOverloadingSection />
      <ContainerProtocolSection />
      <ContextManagerSection />
    </>
  );
}
