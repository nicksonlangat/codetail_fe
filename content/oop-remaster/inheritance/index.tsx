import { IsARelationshipSection } from "./IsARelationshipSection";
import { SuperSection } from "./SuperSection";
import { MROSection } from "./MROSection";
import { WhenNotToSection } from "./WhenNotToSection";

export const toc = [
  { id: "is-a-relationship", title: "Inheritance models IS-A relationships" },
  { id: "super", title: "super(): calling the parent" },
  { id: "mro", title: "MRO: the order Python searches" },
  { id: "when-not-to", title: "When not to use inheritance" },
];

export default function InheritanceArticle() {
  return (
    <>
      <IsARelationshipSection />
      <SuperSection />
      <MROSection />
      <WhenNotToSection />
    </>
  );
}
