import { ClassBasicsSection } from "./ClassBasicsSection";
import { InheritanceSection } from "./InheritanceSection";
import { PropertiesSection } from "./PropertiesSection";
import { DunderSection } from "./DunderSection";
import { WhenToUseSection } from "./WhenToUseSection";

export const toc = [
  { id: "class-basics", title: "Class basics" },
  { id: "inheritance", title: "Inheritance" },
  { id: "properties", title: "Properties" },
  { id: "dunder", title: "Dunder methods" },
  { id: "when-to-use", title: "When to use classes" },
];

export default function ClassesAndOopArticle() {
  return (
    <>
      <ClassBasicsSection />
      <InheritanceSection />
      <PropertiesSection />
      <DunderSection />
      <WhenToUseSection />
    </>
  );
}
