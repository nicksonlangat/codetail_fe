import { CompositionSection } from "./CompositionSection";
import { DataclassSection } from "./DataclassSection";
import { ClassAndStaticMethodsSection } from "./ClassAndStaticMethodsSection";
import { CapstoneSection } from "./CapstoneSection";

export const toc = [
  { id: "composition", title: "Composition over inheritance" },
  { id: "dataclass", title: "@dataclass: stop writing boilerplate" },
  { id: "class-and-static-methods", title: "@classmethod and @staticmethod" },
  { id: "capstone", title: "Putting it together: a small order system" },
];

export default function CompositionAndModernOopArticle() {
  return (
    <>
      <CompositionSection />
      <DataclassSection />
      <ClassAndStaticMethodsSection />
      <CapstoneSection />
    </>
  );
}
